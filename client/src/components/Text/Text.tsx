import { Title as TextMantine } from "@mantine/core";
import styles from "./Text.module.scss";
import { useGetCSSVars } from "../../lib/useGetCSSVars";

type Props = {
  children?: React.ReactNode;
  color?: string;
  size?: number | string;
  fw?: number;
  gradient?: boolean;
};

export const Text: React.FC<Props> = ({
  children = "",
  color = "black",
  size = 14,
  fw = 500,
  gradient = false,
}) => {
  const currentColor = useGetCSSVars("color", color);

  const fontSizeMapping: { [key: string]: number } = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    h1: 30,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 15,
    h6: 10,
  };

  let resolvedSize: string =
    typeof size === "number"
      ? size >= 20
        ? `${size / 1.3 - 3}px`
        : `${size}px`
      : fontSizeMapping[size]?.toString() || size;

  return (
    <TextMantine
      className={gradient ? styles.gradientText : undefined}
      style={{
        color: gradient ? undefined : currentColor,
        fontSize: resolvedSize,
        fontWeight: fw,
        lineHeight: `${140}%`,
      }}
    >
      {children}
    </TextMantine>
  );
};
