import { components } from "@bifrost/lib/api";
import z from "zod";

export const gender = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;

export const grades = [
  "FRESHMAN",
  "SOPHOMORE",
  "JUNIOR",
  "SENIOR",
  "GRADUATE",
  "OTHER",
] as const;

export const ethnicity = [
  "NATIVE_AMERICAN",
  "ASIAN_PACIFIC_ISLANDER",
  "BLACK_AFRICAN_AMERICAN",
  "HISPANIC_LATINO",
  "WHITE_CAUCASIAN",
  "MULTIPLE_OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

export const tShirtSize = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const applicationSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/),
    school: z.string().min(1),
    grade: z.enum(grades),
    age: z.coerce.number().int().positive(),
    gender: z.enum(gender),
    ethnicity: z.enum(ethnicity),
    city: z.string().min(1),
    major: z.string().min(1),
    relevantCoursework: z.array(z.string().min(1)),
    programmingLanguages: z.array(z.string().min(1)),
    previousProgrammingExperience: z.boolean(),
    statement: z.string(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    resume: z.instanceof(File, { message: "Resume must be a file" }),
    personalWebsiteUrl: z.string().url().optional(),
    dietaryRestrictions: z.string().optional(),
    tshirtSize: z.enum(tShirtSize),
    accessibilityNeeds: z.string().optional(),
    travelReimbursementAcknowledgement: z.boolean(),
    travelReimbursementDetails: z.string().optional(),
    codeOfConductAcknowledgement: z.boolean(),
    privacyPolicyAcknowledgement: z.boolean(),
    termsAndConditionsAcknowledgement: z.boolean(),
    photoReleaseAcknowledgement: z.boolean(),
  })
  .superRefine((arg, ctx) => {
    if (!arg.codeOfConductAcknowledgement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["codeOfConductAcknowledgement"],
        message: "You must agree to the code of conduct",
      });
    }

    if (!arg.privacyPolicyAcknowledgement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["privacyPolicyAcknowledgement"],
        message: "You must agree to the privacy policy",
      });
    }

    if (!arg.termsAndConditionsAcknowledgement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["termsAndConditionsAcknowledgement"],
        message: "You must agree to the terms and conditions",
      });
    }

    if (!arg.photoReleaseAcknowledgement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["photoReleaseAcknowledgement"],
        message: "You must agree to the photo release",
      });
    }

    if (
      arg.travelReimbursementAcknowledgement &&
      !arg.travelReimbursementDetails
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["travelReimbursementDetails"],
        message: "You must provide travel reimbursement details",
      });
    }
  });
