"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/sdcn-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/sdcn-popover";
import { Control, useController } from "react-hook-form";
import { DayPicker } from "react-day-picker";

interface DatePickerProps {
  control: Control<any>;
  name: string;
}

export const CustomDatePicker = ({ control, name }: DatePickerProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  const [month, setMonth] = React.useState<Date>(value || new Date());
  const [yearInput, setYearInput] = React.useState<string>(
    month.getFullYear().toString()
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleYearChange = (inputYear: string) => {
    setYearInput(inputYear);
    const year = parseInt(inputYear, 10);
    if (!isNaN(year) && year.toString() === inputYear) {
      setMonth(new Date(year, month.getMonth()));
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setMonth(new Date(month.getFullYear(), monthIndex));
  };

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal text-[1.6rem] h-[5rem]",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground text-black-100",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-[2rem] w-[2rem]" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <div className="flex justify-between items-center p-3 border-b">
          <input
            type="number"
            value={yearInput}
            onChange={(e) => handleYearChange(e.target.value)}
            className="px-2 py-1 rounded border text-[1.4rem] w-[8rem]"
            min="1"
            max="9999"
          />
          <select
            value={month.getMonth()}
            onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded border text-[1.4rem]"
          >
            {months.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
        <DayPicker
          mode="single"
          selected={value}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          // fromDate={new Date()}
          className="p-3 rounded-md shadow-md text-black-100"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-[1.6rem] font-bold",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-[3rem] w-[3rem] bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-[1.4rem] font-medium w-[4rem] h-[4rem] flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: "text-center text-[1.4rem] p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-[4rem] w-[4rem] p-0 font-normal aria-selected:opacity-100",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
