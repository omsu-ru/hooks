/**
 * @desc The 'useBreakpoint()' hook is used to get the current
 *       screen breakpoint based on the TailwindCSS config.
 *
 * @usage
 *    import { useBreakpoint } from "@/hooks/useBreakpoint";
 *
 *    const { isAboveSm, isBelowSm, sm } = useBreakpoint("sm");
 *    console.log({ isAboveSm, isBelowSm, sm });
 *
 *    const { isAboveMd } = useBreakpoint("md");
 *    const { isAboveLg } = useBreakpoint("lg");
 *    const { isAbove2Xl } = useBreakpoint("2xl");
 *    console.log({ isAboveMd, isAboveLg, isAbove2Xl });
 * @requirements npm install react-responsive
 */

import { useMediaQuery } from "react-responsive";



 
const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};


type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  const breakpointValue =
    breakpoints[breakpointKey as keyof typeof breakpoints];
  const bool = useMediaQuery({
    query: `(min-width: ${breakpointValue})`,
  });
  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
  type KeyAbove = `isAbove${Capitalize<K>}`;
  type KeyBelow = `isBelow${Capitalize<K>}`;

  return {
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    [`isBelow${capitalizedKey}`]: !bool,
    [`isAbove${capitalizedKey}`]: bool,
  } as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>;
}
