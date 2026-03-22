"use client"

import AppTabs from "@/components/app/app-tabs";
import { SCHOOL_CONFIG } from "@/lib/routes";
import { LuBuilding2, LuMapPin } from "react-icons/lu";
import AcademicLevels from "./_tab-contents/academic-levels/academic-levels";
import Campuses from "./_tab-contents/campuses/campuses";
import Departments from "./_tab-contents/departments/departments";
import Faculties from "./_tab-contents/faculties/faculties";

export default function SchoolConfiguration() {
    return (
        <>
            <AppTabs tabs={tabs} route={SCHOOL_CONFIG} defaultValue="campuses" />
        </>
    );
}

export const tabs = [
    // {
    //     label: "School Information",
    //     value: "school-information",
    //     Icon: LuSchool,
    //     content: <SchoolInformation />
    // },
    {
        label: "Campuses",
        value: "campuses",
        Icon: LuMapPin,
        content: <Campuses />
    },
    {
        label: "Faculties",
        value: "faculties",
        Icon: LuBuilding2,
        content: <Faculties />
    },
    {
        label: "Departments",
        value: "departments",
        Icon: LuBuilding2,
        content: <Departments />
    },
    {
        label: "Academic Levels",
        value: "academic-levels",
        Icon: LuBuilding2,
        content: <AcademicLevels />
    },
    // {
    //     label: "Program Types",
    //     value: "program-types",
    //     Icon: LuBookOpen,
    //     content: <AcademicProgramTypes />
    // },

    // {
    //     label: "Academic Positions",
    //     value: "academic-positions",
    //     Icon: LuBriefcase,
    //     content: <AcademicPositions />
    // },
    // {
    //     label: "Academic Awards",
    //     value: "academic-awards",
    //     Icon: LuAward,
    //     content: <AcademicAwards />
    // },
];
