// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { enUS } from "@mui/x-date-pickers/locales";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

// components

export interface IDateTimeRangePickerProps {
  onChange: (dateFrom: Date, dateTo: Date) => void;
}

const DateTimeRangePicker = ({ onChange }: IDateTimeRangePickerProps) => {
  const [dateFromState, setDateFromState] = useState<Moment>(
    moment(Date.now() - 7 * 86400 * 1000)
  );
  const [dateToState, setDateToState] = useState<Moment>(moment(Date.now()));

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme: any) => theme.palette["info"].darker,
        bgcolor: (theme: any) => theme.palette["info"].lighter,
      }}
    >
      <LocalizationProvider
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
        dateAdapter={AdapterMoment}
      >
        <DateTimePicker
          sx={{ mr: 2 }}
          label={"Date from"}
          value={dateFromState}
          onChange={(newValue) => {
            if (newValue === null) {
              return;
            }
            setDateFromState(newValue);
            onChange(newValue.toDate(), dateToState.toDate());
          }}
        />
        <DateTimePicker
          label={"Date to"}
          value={dateToState}
          onChange={(newValue) => {
            if (newValue === null) {
              return;
            }
            setDateToState(newValue);
            onChange(dateFromState.toDate(), newValue.toDate());
          }}
        />
      </LocalizationProvider>
    </Card>
  );
};

DateTimeRangePicker.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default DateTimeRangePicker;
