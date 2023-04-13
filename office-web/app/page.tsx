"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Toast from "@radix-ui/react-toast";
import SignInForm from "@/components/Form/SignInForm";
import SignUpForm from "@/components/Form/SignUpForm";

const SignUp = () => {
  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="flex justify-center items-center h-[100vh] w-[100vw] my-16">
        <div className="flex flex-col justify-center items-center w-[38rem] bg-gray-100 rounded-lg p-12 shadow-lg">
          <h1 className="font-title font-bold text-2xl mb-10 flex">
            <p className="font-title font-bold text-2xl text-blue-500">.off</p>
            ice
          </h1>
          <Tabs.Root
            defaultValue="tab1"
            orientation="horizontal"
            activationMode="manual"
            className=""
          >
            <Tabs.List
              aria-label="tabs example"
              className="mb-8 flex justify-center items-center"
            >
              <Tabs.Trigger
                value="tab1"
                className="px-4 py-2 rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
              >
                Já faço parte de um escritório
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab2"
                className="px-4 py-2 rounded-tl-lg border-b-2 border-gray-300 text-gray-500 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 hover:text-gray-700 transition-colors"
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
      </div>
    </Toast.Provider>
  );
};

export default SignUp;
