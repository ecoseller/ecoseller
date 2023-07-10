import {HTTPMETHOD} from "@/types/common";
import {NextApiRequest, NextApiResponse} from "next";
import {api, setRequestResponse} from "@/utils/interceptors/api";

const dashboardUrl = "recommender/dashboard/recommender-system";

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
        .then((response) => {
            return {
              performance: response.data.performance,
              training: response.data.training,
              config: {
                retrievalSize: response.data.config.retrieval_size,
                orderingSize: response.data.config.ordering_size,
                homepageRetrievalCascade: response.data.config.homepage_retrieval_cascade,
                homepageScoringCascade: response.data.config.homepage_scoring_cascade,
                categoryListScoringCascade: response.data.config.category_list_scoring_cascade,
                productDetailRetrievalCascade: response.data.config.product_detail_retrieval_cascade,
                productDetailScoringCascade: response.data.config.product_detail_scoring_cascade,
                cartRetrievalCascade: response.data.config.cart_retrieval_cascade,
                cartScoringCascade: response.data.config.cart_scoring_cascade,
                easeConfig: {
                  l2Options: response.data.config.ease_config.l2_options
                },
                gru4recConfig: {
                  numEpochsOptions: response.data.config.gru4rec_config.num_epochs_options,
                  batchSizeOptions: response.data.config.gru4rec_config.batch_size_options,
                  embeddingSizeOptions: response.data.config.gru4rec_config.embedding_size_options,
                  hiddenSizeOptions: response.data.config.gru4rec_config.hidden_size_options,
                  learningRateOptions: response.data.config.gru4rec_config.learning_rate_options,
                }
              }
            }
        })
        .catch((error: any) => {
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};