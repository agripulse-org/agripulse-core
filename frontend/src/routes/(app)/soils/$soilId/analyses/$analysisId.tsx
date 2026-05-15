import { createFileRoute, notFound } from "@tanstack/react-router";
import { APIError } from "@/services/apiClient";
import { getSoilAnalysisQueryOptions } from "@/data/soilAnalysis";
import { AnalysisDetailsPage } from "@/components/analyses/details/AnalysisDetailsPage";

export const Route = createFileRoute("/(app)/soils/$soilId/analyses/$analysisId")({
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(
        getSoilAnalysisQueryOptions(params.soilId, params.analysisId),
      );
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 404) {
        throw notFound();
      }
      throw error;
    }
  },
  component: AnalysisDetailsRoute,
});

function AnalysisDetailsRoute() {
  const { soilId, analysisId } = Route.useParams();
  return <AnalysisDetailsPage soilId={soilId} analysisId={analysisId} />;
}
