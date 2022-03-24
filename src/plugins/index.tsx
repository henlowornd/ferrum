import FerrumPlugin from "../client/components/FerrumPlugin";
import { FerrumPluginOption } from "../client/types";
import VideoPlugin from "./VideoPlugin";

export const plugins: FerrumPluginOption[] = [
    VideoPlugin.option
];