import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CategoriesRepository } from 'src/app/category/category.repository';
import { FullProject } from 'src/app/project/project.repository';

// Checks that the tags given to a folder or file can be used on this project:
// the category must be the office's and the step must be the project's.
export async function validateTags(
  categoriesRepository: CategoriesRepository,
  office_id: string,
  project: FullProject,
  tags: { category_id?: string | null; project_step_id?: string | null }[],
): Promise<void> {
  const categoryIds = new Set(
    tags.map((tag) => tag.category_id).filter(Boolean),
  );

  for (const category_id of categoryIds) {
    const category = await categoriesRepository.findById(category_id);

    if (!category || category.office_id !== office_id) {
      throw new UnauthorizedException();
    }
  }

  const stepIds = new Set(project.project_steps.map((step) => step.id));

  if (
    tags.some((tag) => tag.project_step_id && !stepIds.has(tag.project_step_id))
  ) {
    throw new BadRequestException('Step does not belong to the project.');
  }
}
