import {
  useId,
  Link,
  useToastController,
  ToastTitle,
  ToastTrigger,
  Toast,
} from "@fluentui/react-components";

export const useToast = () => {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = (
    href: string,
    linkText: string,
    toastMessage: string,
    intent: "success" | "error" | "warning" | "info"
  ) =>
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <Link href={href}>{linkText}</Link>
            </ToastTrigger>
          }
        >
          {toastMessage}
        </ToastTitle>
      </Toast>,
      { intent }
    );

  return { notify, toasterId };
};
