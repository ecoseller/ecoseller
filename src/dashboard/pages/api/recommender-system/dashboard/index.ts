import {HTTPMETHOD} from "@/types/common";
import {NextApiRequest, NextApiResponse} from "next";
import {api, setRequestResponse} from "@/utils/interceptors/api";

const dashboardUrl = "recommender/dashboard/recommender-system";

function convertItem(data: any, k: number) {
  return {
    k: k,
    statistics: {
      coverage: data.coverage,
      directHit: data.direct_hit,
      futureHit: data.future_hit,
    }
  }
}

export const dashboardStatsAPI = async (
  method: HTTPMETHOD,
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
        .get(dashboardUrl, {params: {date_from: dateFrom, date_to: dateTo}})
        .then((response) => response.data
    // {
    //         return {
    //           models: response.data.models,
    //           performance: {
    //             k: response.data.performance.k,
    //             item: convertItem(response.data.performance.item, response.data.performance.k),
    //             models: response.data.performance.models.map((item: any) => {
    //               return {
    //                 k: response.data.performance.k,
    //                 name: item.model_name,
    //                 item: convertItem(item.item, response.data.performance.k),
    //                 types: item.types.map((typeItem: any) => {
    //                   return {
    //                     k: response.data.performance.k,
    //                     name: typeItem.recommendation_type,
    //                     item: convertItem(typeItem.item, response.data.performance.k)
    //                   }
    //                 })
    //               }
    //             })
    //           },
    //           training: {
    //             models: response.data.training.models.map((item: any) => {
    //               if (item.statistics === null || item.statistics === undefined) {
    //                 return undefined;
    //               } else {
    //                 return {
    //                   name: item.model_name,
    //                   statistics: {
    //                     duration: item.statistics.duration,
    //                     peakMemory: item.statistics.peak_memory,
    //                     peakMemoryPercentage: item.statistics.peak_memory_percentage,
    //                     fullTrain: item.statistics.full_train,
    //                     metrics: item.statistics.metrics,
    //                     hyperparameters: item.statistics.hyperparameters,
    //                   }
    //                 }
    //               }
    //             }),
    //           },
    //           config: {
    //             retrievalSize: response.data.config.retrieval_size,
    //             orderingSize: response.data.config.ordering_size,
    //             homepageRetrievalCascade: response.data.config.homepage_retrieval_cascade,
    //             homepageScoringCascade: response.data.config.homepage_scoring_cascade,
    //             categoryListScoringCascade: response.data.config.category_list_scoring_cascade,
    //             productDetailRetrievalCascade: response.data.config.product_detail_retrieval_cascade,
    //             productDetailScoringCascade: response.data.config.product_detail_scoring_cascade,
    //             cartRetrievalCascade: response.data.config.cart_retrieval_cascade,
    //             cartScoringCascade: response.data.config.cart_scoring_cascade,
    //             easeConfig: {
    //               l2Options: response.data.config.ease_config.l2_options
    //             },
    //             gru4recConfig: {
    //               numEpochsOptions: response.data.config.gru4rec_config.num_epochs_options,
    //               batchSizeOptions: response.data.config.gru4rec_config.batch_size_options,
    //               embeddingSizeOptions: response.data.config.gru4rec_config.embedding_size_options,
    //               hiddenSizeOptions: response.data.config.gru4rec_config.hidden_size_options,
    //               learningRateOptions: response.data.config.gru4rec_config.learning_rate_options,
    //             }
    //           }
    //         }
    //     }
        )
        .catch((error: any) => {
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};