import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BodyPage } from "../../components/Themed";

export default function ForgotPassword() {
  return (
    <BodyPage>
      <StatusBar style="light" />
      <Link href="../" className="text-black">
        Dismiss
      </Link>
    </BodyPage>
  );
}
