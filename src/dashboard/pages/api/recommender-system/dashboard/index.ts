import { HTTPMETHOD } from "@/types/common";
import { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";

const dashboardUrl = "recommender/dashboard/recommender-system";
const scheduleTrainingUrl =
  "recommender/dashboard/recommender-system/schedule-training";

function convertItem(data: any, k: number) {
  return {
    k: k,
    statistics: {
      coverage: data.coverage,
      directHit: data.direct_hit,
      futureHit: data.future_hit,
    },
  };
}

export const dashboardStatsAPI = async (
  method: HTTPMETHOD,
  page: string,
  dateFrom: Date,
  dateTo: Date,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "GET":
      return await api
        .get(dashboardUrl, {
          params: { date_from: dateFrom, date_to: dateTo, page },
        })
        .then((response) => response.data)
        .catch((error: any) => {
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};

export const scheduleTraining = async (
  model_name: string,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  return await api
    .post(scheduleTrainingUrl, {
      model_name,
    })
    .then((response) => response.data)
    .catch((error: any) => {
      throw error;
    });
};
