import { SlGlobe } from "react-icons/sl";
import { VscJson } from "react-icons/vsc";
import { BiHourglass } from "react-icons/bi";
import { LuFilter } from "react-icons/lu";
import { GiChoice } from "react-icons/gi";
import { TfiLoop } from "react-icons/tfi";
import { HiCursorArrowRipple } from "react-icons/hi2";
import {
  PiChatCircleText,
  PiCodeBlock,
  PiGitFork,
  PiLightningFill,
  PiMagnet,
  PiWarningOctagonFill,
} from "react-icons/pi";
import { TbApi } from "react-icons/tb";

export const ICON_MAP: Record<string, any> = {
  TRIGGER: HiCursorArrowRipple,
  ACTION: TbApi,
  WEBHOOK: PiLightningFill,
  CHAT: PiChatCircleText,
  MANUAL_API: SlGlobe,
  SET: VscJson,
  DELAY: BiHourglass,
  FILTER: LuFilter,
  CONDITION: GiChoice,
  TRANSFORM: PiCodeBlock,
  EXTRACT: PiMagnet,
  LOOP: TfiLoop,
  SWITCH: PiGitFork,
  FAIL: PiWarningOctagonFill,
};
