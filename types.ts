
export type StylistName = 'Adil' | 'Archana' | 'Fardeen' | 'Nikita' | 'Soniya';

export interface StylistRating {
  name: StylistName;
  rating: number | null;
}

export interface SurveyData {
  stylistRatings: StylistRating[];
  isFirstVisit: boolean | null;
  isSatisfied: boolean | null;
  isWelcoming: boolean | null;
  isTimely: boolean | null;
  teaOffered: boolean | null;
  packagesExplained: boolean | null;
  reviewRequested: boolean | null;
  couponReceived: boolean | null;
  additionalComments: string;
  mobileNumber: string | null;
}

export type StepId =
  | 'welcome'
  | 'q1_stylists'
  | 'q2_first_visit'
  | 'q3_satisfied'
  | 'q4_environment'
  | 'q5_timely'
  | 'q6_tea'
  | 'q7_packages'
  | 'q8_review'
  | 'q9_coupon'
  | 'q10_comments'
  | 'loading'
  | 'completion';
