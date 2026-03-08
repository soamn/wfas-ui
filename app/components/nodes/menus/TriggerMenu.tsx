"use client";

import { useFlowStore } from "@/app/store/node/node.store";
import {
  PiHandTapBold,
  PiClockAfternoonBold,
  PiInfo,
  PiTerminalBold,
} from "react-icons/pi";
import { useState, useEffect } from "react";

const WEEKDAYS = [
  { name: "Sun", cron: 0 },
  { name: "Mon", cron: 1 },
  { name: "Tue", cron: 2 },
  { name: "Wed", cron: 3 },
  { name: "Thu", cron: 4 },
  { name: "Fri", cron: 5 },
  { name: "Sat", cron: 6 },
];

const parseCronExpression = (cronString: string | undefined) => {
  if (!cronString) {
    return {
      interval: "daily",
      time: "09:00",
      weekdays: [],
    };
  }

  const parts = cronString.split(" ");
  if (parts.length < 5) {
    console.warn("Invalid cron string format:", cronString);
    return { interval: "daily", time: "09:00", weekdays: [] };
  }

  const minute = parts[0];
  const hour = parts[1];
  const dayOfMonth = parts[2];
  const month = parts[3];
  const dayOfWeek = parts[4];

  const parsedMinute = parseInt(minute);
  const parsedHour = parseInt(hour);

  if (isNaN(parsedMinute) || isNaN(parsedHour)) {
    console.warn("Invalid minute or hour in cron string:", cronString);
    return { interval: "daily", time: "09:00", weekdays: [] };
  }

  const time = `${String(parsedHour).padStart(2, "0")}:${String(parsedMinute).padStart(2, "0")}`; // Format as HH:MM

  if (
    minute === "0" &&
    hour === "*" &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "*"
  ) {
    return {
      interval: "hourly",
      time: "00:00",
      weekdays: [],
    };
  } else if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return {
      interval: "daily",
      time: time,
      weekdays: [],
    };
  } else if (dayOfMonth === "*" && month === "*") {
    const weekdays = dayOfWeek.split(",").map(Number);
    if (weekdays.some(isNaN)) {
      console.warn("Invalid weekday in cron string:", cronString);
      return { interval: "daily", time: "09:00", weekdays: [] };
    }
    return {
      interval: "weekly",
      time: time,
      weekdays: weekdays,
    };
  }

  return {
    interval: "daily",
    time: "09:00",
    weekdays: [],
  };
};

const generateCron = (
  interval: string,
  time: string,
  weekdays: number[] = [],
) => {
  const [hour, minute] = time.split(":").map(Number);
  if (interval === "hourly") return `0 * * * *`;
  if (interval === "daily") return `${minute} ${hour} * * *`;
  if (interval === "weekly") {
    const cronWeekdays = weekdays.length > 0 ? weekdays.join(",") : "0"; // Default to Sunday if no days selected
    return `${minute} ${hour} * * ${cronWeekdays}`;
  }
  return "";
};

export function TriggerMenu({ id }: { id: string }) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const config = useFlowStore((s) => s.getNodeConfig(id));

  const [interval, setInterval] = useState<string>("daily");
  const [time, setTime] = useState<string>("09:00");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);

  if (!config) return null;

  useEffect(() => {
    if (config.triggerType === "schedule" && config.cronExpression) {
      const { interval, time, weekdays } = parseCronExpression(
        config.cronExpression,
      );
      setInterval(interval);
      setTime(time);
      setSelectedWeekdays(weekdays);
    } else {
      setInterval("daily");
      setTime("09:00");
      setSelectedWeekdays([]);
    }
  }, [config.cronExpression, config.triggerType]);

  const handleTypeChange = (type: "manual" | "schedule") => {
    updateNodeConfig(id, {
      triggerType: type,
      cronExpression:
        type === "schedule"
          ? generateCron(interval, time, selectedWeekdays)
          : undefined,
    });
  };

  const handleScheduleUpdate = (
    newInterval: string,
    newTime: string,
    newWeekdays: number[] = selectedWeekdays,
  ) => {
    setInterval(newInterval);
    setTime(newTime);
    setSelectedWeekdays(newWeekdays);
    updateNodeConfig(id, {
      cronExpression: generateCron(newInterval, newTime, newWeekdays),
    });
  };

  const toggleWeekday = (weekdayCron: number) => {
    const newWeekdays = selectedWeekdays.includes(weekdayCron)
      ? selectedWeekdays.filter((day) => day !== weekdayCron)
      : [...selectedWeekdays, weekdayCron];
    handleScheduleUpdate(interval, time, newWeekdays);
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-white dark:bg-[#0C0C0C] h-full transition-colors duration-300">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
          Trigger Method
        </label>

        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 dark:bg-zinc-900/50 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
          <button
            onClick={() => handleTypeChange("manual")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              config.triggerType === "manual"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            <PiHandTapBold size={16} />
            Manual
          </button>

          <button
            onClick={() => handleTypeChange("schedule")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              config.triggerType === "schedule"
                ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            <PiClockAfternoonBold size={16} />
            Schedule
          </button>
        </div>
      </div>

      {/* SECTION: SCHEDULE CONFIG */}
      {config.triggerType === "schedule" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-tight">
                Frequency
              </span>
              <select
                value={interval}
                onChange={(e) => handleScheduleUpdate(e.target.value, time)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20 outline-none transition-all"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-tight">
                Start Time
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => handleScheduleUpdate(interval, e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {interval === "weekly" && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-tight">
                Weekdays
              </span>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.cron}
                    onClick={() => toggleWeekday(day.cron)}
                    className={`flex items-center justify-center p-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      selectedWeekdays.includes(day.cron)
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 hover:bg-slate-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-900 dark:bg-black/40 rounded-2xl border border-slate-800 dark:border-zinc-800/50 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiTerminalBold
                  className="text-slate-500 dark:text-zinc-600"
                  size={14}
                />
                <span className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
                  Cron Expression
                </span>
              </div>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-baseline gap-2">
              <code className="block font-mono text-sm text-white dark:text-emerald-400 tracking-[0.2em]">
                {config.cronExpression || "* * * * *"}
              </code>
            </div>

            <p className="text-[9px] text-slate-500 dark:text-zinc-600 leading-relaxed italic">
              Runtime schedules use UTC synchronization.
            </p>
          </div>
        </div>
      )}

      {config.triggerType === "manual" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-[2.5rem] text-center group">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/5 text-blue-500 dark:text-blue-400/60 rounded-full mb-4 transition-transform group-hover:scale-110 duration-300">
            <PiInfo size={24} />
          </div>
          <h4 className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-2">
            On-Demand Execution
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-zinc-600 leading-relaxed max-w-[160px]">
            This flow is passive and requires a manual signal to start.
          </p>
        </div>
      )}
    </div>
  );
}
