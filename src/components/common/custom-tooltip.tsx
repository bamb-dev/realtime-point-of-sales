import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CustomTooltip = ({
  children,
  text,
  classNameText,
}: {
  children: React.ReactNode;
  text: string;
  classNameText?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className={classNameText}>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
