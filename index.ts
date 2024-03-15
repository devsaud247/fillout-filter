import http from "http";

import express, { Request, Response } from "express";
import fetch from "node-fetch";
import { RequestParams, ResponsesPayloadType } from "./globals.js";

const PORT = process.env.PORT;
const API_KEY = process.env.FILLOUT_API_KEY;
const BASE_URL = process.env.FILLOUT_BASE_URL;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/v1/api/forms/:formId/filteredResponses",
  async (request: Request, response: Response) => {
    const { formId } = request.params;

    let { filters, ...queryParams } = request.query as unknown as RequestParams;

    filters = filters ? JSON.parse(filters as unknown as string) : [];

    if (!formId)
      return response
        .status(401)
        .json({ message: "Invalid request with form id not provided" });

    const fetchFormsUrl = `${BASE_URL}/v1/api/forms/${formId}/submissions?${Object.entries(
      queryParams
    )
      .map((param) => `${param[0]}=${param[1]}`)
      .join("&")}`;

    const result = await fetch(fetchFormsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = (await result.json()) as ResponsesPayloadType;

    if (!filters?.length) return response.json(data);

    const filteredResponses = data?.responses.filter((response) => {
      return filters?.every((filter) => {
        const question = response.questions.find(
          (question) => question.id === filter.id
        );
        if (!question) return false;

        switch (filter.condition) {
          case "equals":
            return question.value === filter.value;
          case "does_not_equal":
            return question.value !== filter.value;
          case "greater_than":
            return new Date(question.value as Date) > new Date(filter.value);
          case "less_than":
            return new Date(question.value as Date) < new Date(filter.value);
          default:
            return false;
        }
      });
    });

    const totalResponses = filteredResponses.length;
    const pageCount = Math.ceil(totalResponses / 10);

    return response.json({
      responses: filteredResponses,
      totalResponses,
      pageCount,
    });
  }
);

http.createServer(app).listen(PORT, () => {
  console.log(`Server setup completed. Listening on ${PORT}`);
});
