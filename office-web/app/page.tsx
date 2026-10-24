"use client";

import * as Tabs from "@radix-ui/react-tabs";
import SignInForm from "@/app/components/Form/SignInForm";
import SignUpForm from "@/app/components/Form/SignUpForm";
import Image from "next/image";
import backDrop from "../public/processing-back.svg";
import Logo from "@/app/components/Logo";

const SignUp = () => {
  return (
    // Card only on phones and tablets; the illustration joins it from lg up
    <div className="flex gap-4 justify-center items-center min-h-[100dvh] px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col justify-center items-center w-full max-w-[38rem] shrink-0 bg-gray-100 rounded-lg px-5 sm:px-12 pt-8 sm:pt-12 pb-4 shadow-lg">
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
            className="w-full mb-8 flex justify-center items-stretch"
          >
            <Tabs.Trigger
              value="tab1"
              className="w-full min-h-[44px] px-2 sm:px-4 py-2 text-sm sm:text-base rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
            >
              Já faço parte de um escritório
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tab2"
              className="w-full min-h-[44px] px-2 sm:px-4 py-2 text-sm sm:text-base rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
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

      <div className="hidden lg:flex flex-1 min-w-0 max-w-3xl flex-col items-center justify-around py-12 ml-4 h-full">
        <div className="flex flex-col gap-8 justify-center items-center max-w-sm text-center">
          <Logo big />
          <p>Controle seus projetos e clientes em conjunto com seus colegas</p>
        </div>
        <Image
          src={backDrop}
          alt="vector image of two people in a office"
          width={720}
          height={420}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SignUp;
