"use client";

import AppDialog from "@/components/app/app-dialog";
import { IStudent } from "@/data/interface/IStudent";
import {
  Box,
  HStack,
  Stack,
  Text,
  Table,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/sdcn-select";
import { useEffect, useState, useCallback } from "react";
import apiHandler from "@/data/api/ApiHandler";
import { IAcademicSession } from "@/data/interface/IAcademicSession";
import { IAcademicLevel } from "@/data/interface/IAcademicLevel";

type DialogType = "student-bill" | "miscellaneous-bill" | "payment-history" | "credit-note";

interface StudentInfoDialogProps {
  dialogType: DialogType;
  student: IStudent;
  open: boolean;
  redirectUri: string;
}

// Configuration for different dialog types
const dialogConfig = {
  "student-bill": {
    title: "Student Bill",
    columns: ["Bill Name", "Description", "Amount"],
  },
  "miscellaneous-bill": {
    title: "Miscellaneous Bill",
    columns: ["Fee Item", "Description", "Amount"],
  },
  "payment-history": {
    title: "Payment History",
    columns: ["Fee Type", "Date", "Transaction ID", "Bank Code", "Channel", "Amount"],
  },
  "credit-note": {
    title: "Credit Note",
    columns: ["Payment Reference", "Student Code", "Note Name", "Amount", "Date", "Verified"],
  },
};

function StudentInfoDialog({
  dialogType,
  student,
  open,
  redirectUri,
}: StudentInfoDialogProps) {
  const config = dialogConfig[dialogType];
  const [sessions, setSessions] = useState<IAcademicSession[]>([]);
  const [levels, setLevels] = useState<IAcademicLevel[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);

  // Fetch sessions and levels on mount
  useEffect(() => {
    if (!open) return;

    const fetchOptions = async () => {
      setIsOptionsLoading(true);
      try {
        const [sessionRes, levelRes] = await Promise.all([
          apiHandler.academicSession.list(),
          apiHandler.academicLevels.list({ pageSize: 100 }),
        ]);
        
        const fetchedSessions = sessionRes.content || [];
        const fetchedLevels = levelRes.content || [];
        
      
        
        setSessions(fetchedSessions);
        setLevels(fetchedLevels);
        
        // Set defaults if available
        if (fetchedSessions.length > 0) {
          const currentSession = fetchedSessions.find((s: any) => s.isCurrent);
          const defaultSession = currentSession?.code || fetchedSessions[0].code || "";
          setSelectedSession(defaultSession);
        }
        if (fetchedLevels.length > 0) {
          const defaultLevel = student.classCode || fetchedLevels[0].code || "";
          setSelectedLevel(defaultLevel);
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setIsOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [open, student.classCode]);

  // Fetch table data based on dialog type and filters
  const fetchData = useCallback(async () => {
    if (!open || !selectedSession) return;

    setIsLoading(true);
    try {
      let response: any;
      const filters = [
        `studentCode=${student.studentCode}`,
        // `sessionCode=${selectedSession}`
      ];

      if (dialogType === 'credit-note') {
        filters.push(`academicSessionCode=${selectedSession}`);
      } else if (selectedSession) {
        filters.push(`sessionCode=${selectedSession}`);
      }
      
      // if (selectedLevel && dialogType !== "payment-history" && dialogType !== "credit-note" && dialogType !== "miscellaneous-bill") {
      //   filters.push(`level=${selectedLevel}`);
      // }

      switch (dialogType) {
        case "student-bill":
          // Using listByFilter if available, otherwise constructing query
          response = await apiHandler.transactions.list({ filters });
          break;
        case "miscellaneous-bill":
          // Assuming list supports filter or using a generic listBy if available
          response = await apiHandler.miscellaneousBill.list({filters});
          break;
        case "payment-history":
          response = await apiHandler.feePayment.listByfilters({ filters });
          break;
        case "credit-note":
          response = await apiHandler.creditNote.list({ filters });
          break;
      }

      setTableData(response?.content || []);
    } catch (error) {
      console.error(`Failed to fetch ${dialogType} data:`, error);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  }, [open, dialogType, student.studentCode, selectedSession, selectedLevel, sessions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderTableRow = (data: any, index: number) => {
    switch (dialogType) {
      case "student-bill":
        return (
         <Table.Row key={index}>
            <Table.Cell>{data.billType}</Table.Cell>
            <Table.Cell>{data.note}</Table.Cell>
            <Table.Cell fontWeight="medium">NGN {data.totalAmount?.toLocaleString() || data.amount?.toLocaleString() || "0"}</Table.Cell>
          </Table.Row>

        )
      case "miscellaneous-bill":
        return (
          <Table.Row key={index}>
            <Table.Cell>{data.miscellaneousFeeName || data.code || "Fee Item"}</Table.Cell>
            <Table.Cell>{data.paymentDescription || data.description || "Description"}</Table.Cell>
            <Table.Cell fontWeight="medium">NGN {data.totalAmount?.toLocaleString() || data.amount?.toLocaleString() || "0"}</Table.Cell>
          </Table.Row>
        );
      case "payment-history":
        return (
          <Table.Row key={index}>
            <Table.Cell>{data.purpose || "Fee Type"}</Table.Cell>
            <Table.Cell>{data.paymentDate ? new Date(data.paymentDate).toLocaleDateString() : "Date"}</Table.Cell>
            <Table.Cell>{data.transactionReference || "Transaction ID"}</Table.Cell>
            <Table.Cell>{data.bankCode || "Bank Code"}</Table.Cell>
            <Table.Cell>{data.reOccurrentType || "Channel"}</Table.Cell>
            <Table.Cell fontWeight="medium">NGN {data.amount?.toLocaleString() || "0"}</Table.Cell>
          </Table.Row>
        );
      case "credit-note":
        return (
          <Table.Row key={index}>
            <Table.Cell>{data.code}</Table.Cell>
            <Table.Cell>{student.studentCode}</Table.Cell>
            <Table.Cell>{data.creditNoteName}</Table.Cell>
            <Table.Cell fontWeight="medium">NGN {data.totalAmount?.toLocaleString() || "0"}</Table.Cell>
            <Table.Cell>{data.sessionName}</Table.Cell>
            <Table.Cell>
              {data.isCommited ? (
                <Badge colorScheme="green" size="sm">
                  • Yes
                </Badge>
              ) : (
                <Badge colorScheme="gray" size="sm">
                  No
                </Badge>
              )}
            </Table.Cell>
          </Table.Row>
        );
      default:
        return null;
    }
  };

  return (
    <AppDialog
      title={config.title}
      open={open}
      placement="center"
      redirectUri={redirectUri}
      cancelQueries={[]}
      hasFooter={false}
      size="xl"
    >
      <Stack direction="column" gap={4} py={4} w="full">
        {/* Student Information Header */}
        <Box>
          <HStack gap={6} fontSize="sm" color="gray.600">
            <Text>
              <Text as="span" fontWeight="medium" color="gray.700">
                Name:
              </Text>{" "}
              {student.firstName} {student.middleName} {student.lastName}
            </Text>
            <Text>
              <Text as="span" fontWeight="medium" color="gray.700">
                Matric No:
              </Text>{" "}
              {student.studentCode}
            </Text>
            <Text>
              <Text as="span" fontWeight="medium" color="gray.700">
                Program:
              </Text>{" "}
              {student.streamName || "N/A"}
            </Text>
          </HStack>
        </Box>

        {/* Session and Level Dropdowns */}
        <HStack gap={4}>
          <Select 
            value={selectedSession} 
            onValueChange={(val) => {
              console.log("Session changed to:", val);
              setSelectedSession(val);
            }}
            disabled={isOptionsLoading}
          >
            <SelectTrigger className="h-10 w-[200px] text-xs">
              <SelectValue placeholder={isOptionsLoading ? "Loading sessions..." : "Select session"}>
                {sessions.find(s => (s.code || s.id?.toString()) === selectedSession)?.sessionName || (isOptionsLoading ? "Loading..." : "Select session")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="text-xs z-[2000]">
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.code || session.id?.toString() || ""} className="text-xs">
                  {session.sessionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {dialogType !== "payment-history" && dialogType !== "credit-note" && dialogType !== "miscellaneous-bill" && (
            <Select 
              value={selectedLevel} 
              onValueChange={(val) => {
                console.log("Level changed to:", val);
                setSelectedLevel(val);
              }}
              // disabled={isOptionsLoading}
              disabled={true}
            >
              <SelectTrigger className="h-10 w-[200px] text-xs">
                <SelectValue placeholder={isOptionsLoading ? "Loading levels..." : "Select level"}>
                  {levels.find(l => (l.code ) === selectedLevel)?.code || (isOptionsLoading ? "Loading..." : "Select level")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-xs z-[2000]">
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.code || ""} className="text-xs">
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </HStack>

        {/* Data Table */}
        <Box overflowX="auto" borderWidth="1px" borderRadius="md" minH="200px">
          {isLoading ? (
            <Center py={10}>
              <Spinner size="lg" color="primary.500" />
            </Center>
          ) : (
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row bg="gray.50">
                  {config.columns.map((column, index) => (
                    <Table.ColumnHeader key={index} fontWeight="semibold">
                      {column}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.length > 0 ? (
                  tableData.map((data, index) => renderTableRow(data, index))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={config.columns.length} textAlign="center" py={10} color="gray.500">
                      No data found for the selected criteria.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      </Stack>
    </AppDialog>
  );
}

export default StudentInfoDialog;
