/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useContext,
    useEffect,
    useRef
} from "react";
import { Button } from "react-bootstrap";
import { FilePond } from "react-filepond";

import MainContext from "../../contexts/MainContext";

import Emitter from "../../utils/emitter";
import Logger from "../../utils/logger";
import DialogBox from "../../components/DialogBox";
import Bar from "../../components/Bar";
import Utils from "../../../Utils";
import {
    ExplorerRightSidebarProps,
    ExplorerRightSidebarState,
    SysInfo
} from "../../types";
import { version, apiUrl } from "../../global";

const defaultSysInfo: SysInfo = {
    system: "Ferrum-DEMO",
    version,
    platform: "-",
    arch: "-",
    userInfo: {
        username: "user",
        homedir: "-"
    },
    memory: {
        total: 100,
        free: 40
    },
    cpuUsage: 13,
    upTime: 0
};

const RightSidebar: React.FC<ExplorerRightSidebarProps> = (props) => {
    const [state, setState] = useState<ExplorerRightSidebarState>({ sysInfo: null });
    const { isDemo } = useContext(MainContext);
    
    // refs
    const pond = useRef<FilePond>(null);
    const sysInfoDialogBox = useRef<DialogBox>(null);
    const memoryUsageBar = useRef<Bar>(null);
    const CPUUsageBar = useRef<Bar>(null);
    
    useEffect(
        () => {
            if(isDemo && memoryUsageBar.current && CPUUsageBar.current) {
                memoryUsageBar.current.setValue(60);
                CPUUsageBar.current.setValue(13);
                
                return;
            }

            const sysInfoWorker = new Worker("../../workers/sysInfo.worker.tsx", { type: "module" });
            sysInfoWorker.postMessage({ type: "getSysInfo", apiUrl });

            sysInfoWorker.onmessage = (e: MessageEvent<SysInfo>) => {
                setState({ sysInfo: e.data });

                if(memoryUsageBar.current && CPUUsageBar.current) { // Update the memory usage bar & cpu usage bar
                    memoryUsageBar.current.setValue(Math.floor(((e.data.memory.total - e.data.memory.free) / e.data.memory.total) * 100));
                    CPUUsageBar.current.setValue(Math.floor(e.data.cpuUsage));
                }
            };
        },
        [] /* <=== This empty array is necessary!! Or the worker instance will be created multiple times */
    );

    var sysInfo = state.sysInfo || defaultSysInfo;
    var usedmem = (sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total;

    var utHour = Math.floor(sysInfo.upTime / 60 / 60);
    var utMinute = Math.floor(sysInfo.upTime / 60) - utHour * 60;
    var utSecond = Math.floor(sysInfo.upTime - utMinute * 60 - utHour * 60 * 60);

    return (
        <aside className="sidebar-right-container">
            <div className="right-sidebar-panel about-container">
                <p><b>{Utils.$("app.name")}</b> {Utils.$("app.description")}</p>
                <p><a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">https://github.com/NriotHrreion/ferrum</a></p>
                <p>
                    <object
                        data="https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?style=social&label=Star"
                        aria-label="Github Stars"></object>
                    <a href="/license">{Utils.$("page.explorer.right.license")}</a>
                    <span>Ver: {version}</span>
                </p>
            </div>
            <div className="right-sidebar-panel upload-container">
                <p>{Utils.$("page.explorer.right.upload.note")}</p>
                <FilePond
                    disabled={isDemo}
                    ref={pond}
                    allowMultiple={true}
                    maxFiles={5}
                    labelIdle={Utils.$("page.explorer.right.upload.placeholder")}
                    server={apiUrl +"/uploadFile?path="+ props.path.replaceAll("/", "\\")}
                    oninit={() => {
                        Logger.log({ value: "Filepond is ready." }, pond.current);
                    }}
                    onprocessfile={() => {
                        Emitter.get().emit("fileListUpdate");
                    }}/>
            </div>
            <div className="right-sidebar-panel system-info-container">
                <ul>
                    <li><b>{Utils.$("sysinfo.system")}:</b> {sysInfo.system}</li>
                    <li><b>{Utils.$("sysinfo.memory")}:</b> {Math.floor(usedmem * 100) +"%"} ({Utils.$("sysinfo.memory.total")} {(sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)})</li>
                    <li><b>{Utils.$("sysinfo.cpu")}:</b> {Math.floor(sysInfo.cpuUsage) +"%"}</li>
                    <li><b>{Utils.$("sysinfo.uptime")}:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                    <li>
                        <Button variant="secondary" onClick={() => {
                            if(sysInfoDialogBox.current) sysInfoDialogBox.current.setOpen(true);
                        }}>{Utils.$("page.explorer.right.sysinfo.details")}</Button>
                    </li>
                </ul>
            </div>

            {DialogBox.createDialog("sys-info",
                <DialogBox ref={sysInfoDialogBox} id="sys-info" title={Utils.$("sysinfo") +" ("+ sysInfo.system +")"}>
                    <div className="sys-info-dialog">
                        <ul>
                            <li><b>{Utils.$("sysinfo.version")}:</b> {sysInfo.version}</li>
                            <li><b>{Utils.$("sysinfo.arch")}:</b> {sysInfo.arch}</li>
                            <li><b>{Utils.$("sysinfo.user.name")}:</b> {sysInfo.userInfo.username}</li>
                            <li><b>{Utils.$("sysinfo.user.home")}:</b> {sysInfo.userInfo.homedir}</li>
                            <li><b>{Utils.$("sysinfo.memory")}:</b> <Bar ref={memoryUsageBar}/> {Math.floor(usedmem * 100) +"% / "+ (sysInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)}</li>
                            <li><b>{Utils.$("sysinfo.cpu")}:</b> <Bar ref={CPUUsageBar}/> {Math.floor(sysInfo.cpuUsage) +"%"}</li>
                            <li><b>{Utils.$("sysinfo.uptime")}:</b> {(utHour < 10 ? "0"+ utHour : utHour) +":"+ (utMinute < 10 ? "0"+ utMinute : utMinute) +":"+ (utSecond < 10 ? "0"+ utSecond : utSecond)}</li>
                        </ul>
                    </div>
                </DialogBox>
            )}
        </aside>
    );
}

export default RightSidebar;
