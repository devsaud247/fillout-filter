export type FilterClauseType = {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: number | string;
};

type Limit = number;
type DateString = string;
type Offset = number;
type Status = "in_progress" | "finished";
type IncludeEditLink = boolean;
type Sort = "asc" | "desc";

export interface RequestParams {
  limit?: Limit;
  afterDate?: DateString;
  beforeDate?: DateString;
  offset?: Offset;
  status?: Status;
  includeEditLink?: IncludeEditLink;
  sort?: Sort;
  filters: FilterClauseType[];
}

type QuestionType = {
  id: string;
  name: string;
  type: "ShortAnswer" | "Email" | "MultipleChoice";
  value: string | number | boolean | Date;
};

type CalculationType = {
  id: string;
  name: string;
  type: "number" | "string" | "date";
  value: string | number | boolean | Date;
};

type UrlParameterType = {
  id: string;
  name: string;
  value: string | number | boolean | Date;
};

type QuizType = {
  score: number;
  maxScore: number;
};

type ResponseType = {
  questions: QuestionType[];
  calculations?: CalculationType[];
  urlParameters?: UrlParameterType[];
  quiz?: QuizType;
  submissionId: string;
  submissionTime: string;
};

type ResponsesPayloadType = {
  responses: ResponseType[];
  totalResponses: number;
  pageCount: number;
};
