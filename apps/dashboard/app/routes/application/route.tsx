import { Card, CardContent, CardHeader, CardTitle } from "@bifrost/ui/ui/card";
import { Input } from "@bifrost/ui/ui/input";
import { parseWithZod } from "@conform-to/zod";

import { useForm } from "@conform-to/react";
import {
  applicationSchema,
  ethnicity,
  gender,
  grades,
  tShirtSize,
} from "~/lib/schemas";
import { Separator } from "@bifrost/ui/ui/separator";
import { Textarea } from "@bifrost/ui/ui/textarea";
import { Checkbox } from "@bifrost/ui/ui/checkbox";
import { FieldDescription, FieldError } from "@bifrost/ui/components/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bifrost/ui/ui/select";

import { Button } from "@bifrost/ui/ui/button";
import { Form, useActionData } from "@remix-run/react";

import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getClient } from "~/services/api.server";
import { Label } from "@bifrost/ui/ui/label";
import { CheckboxConform } from "~/components/checkbox-conform";

export async function action({ request }: LoaderFunctionArgs) {
  const client = await getClient(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: applicationSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const body = submission.value;
  let resume = undefined;
  if (body.resume) {
    const arrayBuffer = await body.resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer).toString("binary");
    resume = buffer;
  }

  const intent = formData.get("submit") ? "submit" : "save";
  if (intent === "save") {
    // check if the application already exists
    const { response } = await client.GET("/api/applications");
    if (response.status === 200) {
      await client.PUT("/api/applications", { body: { ...body, resume } });
    } else {
      await client.POST("/api/applications", { body: { ...body, resume } });
    }
  } else {
    // one last save before submitting
    await client.PUT("/api/applications", { body: { ...body, resume } });
    await client.POST("/api/applications/submit");
  }

  return submission.reply();
}

export async function loader({ request }: LoaderFunctionArgs) {
  const client = await getClient(request);
  const application = await client.GET("/api/applications");
  return { application: application.data };
}

export default function Page() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: actionData,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    // defaultValue: loaderData.application,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: applicationSchema });
    },
  });

  const relevantCoursework = fields.relevantCoursework.getFieldList();
  const programmingLanguages = fields.programmingLanguages.getFieldList();

  return (
    <main className="min-h-screen">
      <div className="container flex items-center justify-center my-48">
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm from-white/85 to-[#B1E2F6]/85 bg-gradient-to-br">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0372A1]">Application</CardTitle>
            <Separator className="my-4 bg-primary" />
          </CardHeader>
          <CardContent>
            <Form
              id={form.id}
              method="POST"
              onSubmit={form.onSubmit}
              encType="multipart/form-data"
            >
              <div className="text-xl font-bold">Personal Info</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <Label>Name*</Label>
                  <Input
                    type="text"
                    key={fields.name.key}
                    name={fields.name.name}
                    defaultValue={fields.name.initialValue}
                  />
                  <FieldError>{fields.name.errors}</FieldError>
                </div>
                <div>
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    key={fields.email.key}
                    name={fields.email.name}
                    defaultValue={fields.email.initialValue}
                  />
                  <FieldError>{fields.email.errors}</FieldError>
                </div>
                <div>
                  <Label>Phone*</Label>
                  <Input
                    type="tel"
                    key={fields.phone.key}
                    name={fields.phone.name}
                    defaultValue={fields.phone.initialValue}
                  />
                  <FieldError>{fields.phone.errors}</FieldError>
                </div>
                <div className="col-span-2">
                  <Label>School*</Label>
                  <Input
                    type="text"
                    key={fields.school.key}
                    name={fields.school.name}
                    defaultValue={fields.school.initialValue}
                  />
                  <FieldError>{fields.school.errors}</FieldError>
                </div>
                <div>
                  <Label>Grade*</Label>
                  <Select
                    key={fields.grade.key}
                    name={fields.grade.name}
                    defaultValue={fields.grade.initialValue}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your current grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{fields.grade.errors}</FieldError>
                </div>
                <div>
                  <Label>Age*</Label>
                  <Input
                    type="number"
                    key={fields.age.key}
                    name={fields.age.name}
                    defaultValue={fields.age.initialValue}
                  />
                  <FieldError>{fields.age.errors}</FieldError>
                </div>
                <div>
                  <Label>Gender*</Label>
                  <Select
                    key={fields.gender.key}
                    name={fields.gender.name}
                    defaultValue={fields.gender.initialValue}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {gender.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{fields.gender.errors}</FieldError>
                </div>
                <div>
                  <Label>Ethnicity*</Label>
                  <Select
                    key={fields.ethnicity.key}
                    name={fields.ethnicity.name}
                    defaultValue={fields.ethnicity.initialValue}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethnicity.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{fields.ethnicity.errors}</FieldError>
                </div>
                <div className="col-span-2">
                  <Label>City*</Label>
                  <Input
                    type="text"
                    key={fields.city.key}
                    name={fields.city.name}
                    defaultValue={fields.city.initialValue}
                  />
                  <FieldError>{fields.city.errors}</FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Skills and Interests</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <Label>Major*</Label>
                  <Input
                    type="text"
                    key={fields.major.key}
                    name={fields.major.name}
                    defaultValue={fields.major.initialValue}
                  />
                  <FieldError>{fields.major.errors}</FieldError>
                </div>

                <div className="col-span-2">
                  <Label>Relevant Coursework*</Label>
                  {relevantCoursework.map((field, index) => {
                    return (
                      <div
                        key={field.key}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Input
                          key={field.key}
                          name={field.name}
                          defaultValue={field.initialValue}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          {...form.remove.getButtonProps({
                            name: fields.relevantCoursework.name,
                            index,
                          })}
                        >
                          -
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    {...form.insert.getButtonProps({
                      name: fields.relevantCoursework.name,
                    })}
                  >
                    + Add More
                  </Button>
                  <FieldError>{fields.relevantCoursework.errors}</FieldError>
                </div>

                <div className="col-span-2">
                  <Label>Programming Languages*</Label>
                  {programmingLanguages.map((field, index) => {
                    return (
                      <div
                        key={field.key}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Input
                          key={field.key}
                          name={field.name}
                          defaultValue={field.initialValue}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          {...form.remove.getButtonProps({
                            name: fields.programmingLanguages.name,
                            index,
                          })}
                        >
                          -
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    {...form.insert.getButtonProps({
                      name: fields.programmingLanguages.name,
                    })}
                  >
                    + Add More
                  </Button>
                  <FieldError>{fields.programmingLanguages.errors}</FieldError>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.previousProgrammingExperience}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor={fields.previousProgrammingExperience.id}>
                        Previous Programming Experience
                      </Label>
                      <FieldDescription>
                        Check if you have previous programming experience
                      </FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.previousProgrammingExperience.errors}
                  </FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Diversity Statement</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <Label>Question 1</Label>
                  <FieldDescription>
                    At TartanHacks, we believe that diverse perspectives,
                    backgrounds, and experiences are crucial to building an
                    environment where everyone is empowered to bring their
                    moonshot ideas to life. If you have a unique background that
                    you'd like to share with us, please do so here! We'll
                    prioritize bringing you to TartanHacks.
                  </FieldDescription>
                  <Textarea
                    className="bg-background"
                    key={fields.statement.key}
                    name={fields.statement.name}
                    defaultValue={fields.statement.initialValue}
                  />
                  <FieldError>{fields.statement.errors}</FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Portfolio</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    key={fields.linkedinUrl.key}
                    name={fields.linkedinUrl.name}
                    defaultValue={fields.linkedinUrl.initialValue}
                  />
                  <FieldError>{fields.linkedinUrl.errors}</FieldError>
                </div>

                <div className="col-span-1">
                  <Label>Github URL</Label>
                  <Input
                    key={fields.githubUrl.key}
                    name={fields.githubUrl.name}
                    defaultValue={fields.githubUrl.initialValue}
                  />
                  <FieldError>{fields.githubUrl.errors}</FieldError>
                </div>

                <div className="col-span-1">
                  <Label>Personal Website URL</Label>
                  <Input
                    key={fields.personalWebsiteUrl.key}
                    name={fields.personalWebsiteUrl.name}
                    defaultValue={fields.personalWebsiteUrl.initialValue}
                  />
                  <FieldError>{fields.personalWebsiteUrl.errors}</FieldError>
                </div>

                <div className="col-span-2">
                  <Label>Attach Resume</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    key={fields.resume.key}
                    name={fields.resume.name}
                  />
                  <FieldError>{fields.resume.errors}</FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Additional Information</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div>
                  <Label>Dietary Restrictions</Label>
                  <Input
                    key={fields.dietaryRestrictions.key}
                    name={fields.dietaryRestrictions.name}
                    defaultValue={fields.dietaryRestrictions.initialValue}
                  />
                  <FieldError>{fields.dietaryRestrictions.errors}</FieldError>
                </div>

                <div>
                  <Label>T-shirt Size</Label>
                  <Select
                    key={fields.tshirtSize.key}
                    name={fields.tshirtSize.name}
                    defaultValue={fields.tshirtSize.initialValue}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your size" />
                    </SelectTrigger>
                    <SelectContent>
                      {tShirtSize.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{fields.tshirtSize.errors}</FieldError>
                </div>

                <div>
                  <Label>Accessibility Needs</Label>
                  <Input
                    key={fields.accessibilityNeeds.key}
                    name={fields.accessibilityNeeds.name}
                    defaultValue={fields.accessibilityNeeds.initialValue}
                  />
                  <FieldError>{fields.accessibilityNeeds.errors}</FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Travel Reimbursement</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.travelReimbursementAcknowledgement}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor={fields.travelReimbursementAcknowledgement.id}
                      >
                        Acknowledgement
                      </Label>
                      <FieldDescription>
                        We will be providing travel reimbursements for a select
                        number of hackers this year! If interested, please
                        indicate. You must submit a project to receive your
                        reimbursement.
                      </FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.travelReimbursementAcknowledgement.errors}
                  </FieldError>
                </div>

                <div className="col-span-2">
                  <Label>Preference</Label>
                  <FieldDescription>
                    If you indicated that you would like to receive travel
                    reimbursement, what mode of transportation would you prefer,
                    and from where? (e.g. train from NYC, flight from SFO, car
                    from Ann Arbor)
                  </FieldDescription>
                  <Textarea
                    className="bg-background"
                    key={fields.travelReimbursementDetails.key}
                    name={fields.travelReimbursementDetails.name}
                    defaultValue={
                      fields.travelReimbursementDetails.initialValue
                    }
                  />
                  <FieldError>
                    {fields.travelReimbursementDetails.errors}
                  </FieldError>
                </div>
              </div>

              <div className="text-xl font-bold">Consent and Agreements</div>
              <div className="grid grid-cols-2 gap-2 m-4">
                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.codeOfConductAcknowledgement}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor={fields.codeOfConductAcknowledgement.id}>
                        Code of Conduct Acknowledgement
                      </Label>
                      <FieldDescription>placeholder</FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.codeOfConductAcknowledgement.errors}
                  </FieldError>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.privacyPolicyAcknowledgement}
                    />
                    <div className="space-y-1 leading-none">
                      <Label>Privacy Policy Acknowledgement</Label>
                      <FieldDescription>placeholder</FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.privacyPolicyAcknowledgement.errors}
                  </FieldError>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.termsAndConditionsAcknowledgement}
                    />
                    <div className="space-y-1 leading-none">
                      <Label>Terms and Conditions Acknowledgement</Label>
                      <FieldDescription>placeholder</FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.termsAndConditionsAcknowledgement.errors}
                  </FieldError>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <CheckboxConform
                      meta={fields.photoReleaseAcknowledgement}
                    />
                    <div className="space-y-1 leading-none">
                      <Label>Photo Release Acknowledgement</Label>
                      <FieldDescription>placeholder</FieldDescription>
                    </div>
                  </div>
                  <FieldError>
                    {fields.photoReleaseAcknowledgement.errors}
                  </FieldError>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" name="save">
                  Save
                </Button>
                <Button name="submit">Submit</Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
