import { useLocation } from "react-router-dom";

export function RegisterButton() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  let registerLink = `https://docs.google.com/forms/d/1l_pvU08U1kjfUameWTHmxIB_Yrwe-SsOKuHosKv6XJE/edit`;
  if (
    params.has("utm_source") &&
    params.has("utm_medium") &&
    params.has("utm_campaign")
  ) {
    registerLink = `${registerLink}?utm_source=${params.get(
      "utm_source",
    )}&utm_medium=${params.get("utm_medium")}&utm_campaign=${params.get(
      "utm_campaign",
    )}`;
  }

  return (
    <div className="text-beige flex justify-center">
      <a href={registerLink} target="_blank" rel="noopener noreferrer">
        <div className="border-2 border-black py-3 px-6 text-2xl font-thin bg-red animate-[float_2s_ease-in-out_infinite] text-black rounded-xl cursor-pointer hover:bg-black hover:text-red hover:border-red">
          Pre-register Now!
        </div>
      </a>
    </div>
  );
}
