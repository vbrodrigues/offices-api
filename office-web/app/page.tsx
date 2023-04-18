"use client";

import * as Tabs from "@radix-ui/react-tabs";
import SignInForm from "@/app/components/Form/SignInForm";
import SignUpForm from "@/app/components/Form/SignUpForm";
import Image from "next/image";
import backDrop from "../public/processing-back.svg";
import Logo from "@/app/components/Logo";

const SignUp = () => {
  return (
    <div className="flex gap-4 justify-center items-center h-[100vh] w-[100vw] my-16">
      <div className="flex flex-col justify-center items-center max-w-[38rem] w-[38rem] bg-gray-100 rounded-lg px-12 pt-12 pb-4 shadow-lg">
        <h1 className="font-title font-bold text-2xl mb-10 flex">
          <p className="font-title font-bold text-2xl text-blue-500">.off</p>
          ice
        </h1>
        <Tabs.Root
          defaultValue="tab1"
          orientation="horizontal"
          activationMode="manual"
          className="w-full "
        >
          <Tabs.List
            aria-label="tabs example"
            className="w-full mb-8 flex justify-center items-center"
          >
            <Tabs.Trigger
              value="tab1"
              className="w-full px-4 py-2 rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
            >
              Já faço parte de um escritório
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tab2"
              className="w-full px-4 py-2 rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
            >
              Começar meu escritório
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <SignInForm />
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <SignUpForm />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <div className="flex flex-col items-center justify-around py-12 ml-4 h-full">
        <div className="flex flex-col gap-8 justify-center items-center max-w-sm text-center">
          <Logo big />
          <p>Controle seus projetos e clientes em conjunto com seus colegas</p>
        </div>
        <Image
          src={backDrop}
          alt="vector image of two people in a office"
          width={720}
          height={420}
          className=""
        />
      </div>
    </div>
  );
};

export default SignUp;
