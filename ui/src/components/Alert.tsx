import "@/components/Alert.css";
import Warning from "@/symbols/Warning";

interface TAlertProps {
  text: string;
}

function Alert({ text }: TAlertProps) {
  return (
    <div className="alert">
      <Warning />
      <p className="text-error">{ text }</p>
    </div>
  )
}

export default Alert;
