"use client";

import { useRouter } from "next/navigation";

import { usePlayerStore } from "@/store/player-store";

import { playerService } from "@/services/player-service";

import { PageShell } from "@/components/layout/page-shell";
import { BottomBar } from "@/components/ui/bottom-bar";
import { InputField } from "@/components/ui/input-field";

const LandingPage = () => {
  const router = useRouter();
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      e.currentTarget.elements.namedItem("username") as HTMLInputElement
    ).value.trim();
    if (!username) return;

    const data = await playerService.login(username);
    setPlayer(data.id, data.username);
    router.push("/home");
  };

  return (
    <PageShell
      bottom={<BottomBar label="เข้าเล่น" type="submit" form="landing-form" />}
    >
      <div className="flex flex-col justify-center flex-1 px-4">
        <form id="landing-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h1 className="font-medium text-[32px] leading-[48px] text-black">
              Nextzy Test (Full Stack)
            </h1>
            <p className="font-normal text-[14px] leading-[120%] text-[#979797]">
              เกมสะสมคะแนน
            </p>
          </div>
          <InputField
            label="ชื่อสำหรับเล่น (Nickname)"
            name="username"
            defaultValue="Demo2"
            required
          />
        </form>
      </div>
    </PageShell>
  );
};

export default LandingPage;
