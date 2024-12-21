import { Card, CardContent, CardHeader, CardTitle } from "@bifrost/ui/ui/card";
import { Input } from "@bifrost/ui/ui/input";

import { useForm } from "@bifrost/lib/hooks/useForm";
import {
  applicationSchema,
  ethnicity,
  gender,
  grades,
  tShirtSize,
  schools,
  countries,
} from "~/lib/schemas";
import { Separator } from "@bifrost/ui/ui/separator";
import { Textarea } from "@bifrost/ui/ui/textarea";
import { Checkbox } from "@bifrost/ui/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bifrost/ui/ui/select";

import {
  FormProvider,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bifrost/ui/ui/form";
import { Button } from "@bifrost/ui/ui/button";
import { Form, useSubmit } from "@remix-run/react";

import { useFieldArray } from "react-hook-form";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getClient } from "~/services/api.server";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());
  const client = await getClient(request);

  const intent = formData.get("submit") ? "submit" : "save";
  if (intent === "save") {
    // check if the application already exists
    const { response } = await client.GET("/api/applications");
    if (response.status === 200) {
      await client.PUT("/api/applications", { body });
    } else {
      await client.POST("/api/applications", { body });
    }
  } else {
    // one last save before submitting
    await client.PUT("/api/applications", { body });
    await client.POST("/api/applications/submit");
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const client = await getClient(request);
  const application = await client.GET("/api/applications");
  return { application: application.data };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const form = useForm({
    schema: applicationSchema,
    defaultValues: {
      first_name: "",
      last_name: "",
      age: undefined,
      phone: "",
      email: "",
      school: undefined,
      grade: undefined,
      gender: undefined,
      ethnicity: undefined,
      city: "",
      country: undefined,
      major: "",
      relevantCoursework: [],
      programmingLanguages: [],
      previousProgrammingExperience: false,
      essayQuestion1: "",
      githubUrl: undefined,
      linkedinUrl: undefined,
      // resume: undefined,
      resumeUrl: "",
      designPortfolio: undefined,
      dietaryRestrictions: "",
      tshirtSize: undefined,
      accessibilityNeeds: undefined,
      travelReimbursementAcknowledgement: false,
      travelReimbursementDetails: undefined,
      codeOfConductAcknowledgement: false,
      photoReleaseAcknowledgement: false,
      mlhCodeOfConductAcknowledgement: false,
      mlhTermsAndConditionsAcknowledgement: false,
      mlhEmailSubscription: false,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    submit(data, { method: "POST", replace: true });
  }, console.error);

  return (
    <main className="min-h-screen">
      <div className="container flex items-center justify-center my-48">
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm from-white/85 to-[#B1E2F6]/85 bg-gradient-to-br">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0372A1]">Application</CardTitle>
            <Separator className="my-4 bg-primary" />
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <Form method="POST" onSubmit={onSubmit}>
                <div className="text-xl font-bold">Personal Info</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age*</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School*</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select your school" />
                              </SelectTrigger>
                              <SelectContent>
                                {schools.map((school) => (
                                  <SelectItem key={school} value={school}>
                                    {school}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="grade"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    name="gender"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {gender.map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="ethnicity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethnicity*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select your ethnicity" />
                            </SelectTrigger>
                            <SelectContent>
                              {ethnicity.map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country*</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select your country of residence" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">Skills and Interests</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Major*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="relevantCoursework"
                      render={() => {
                        const { fields, append, remove } = useFieldArray({
                          control: form.control,
                          name: "relevantCoursework",
                        });

                        return (
                          <FormItem>
                            <FormLabel>Relevant Coursework*</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {fields.map((field, index) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      {...form.register(
                                        `relevantCoursework.${index}`,
                                      )}
                                      placeholder="Enter coursework"
                                    />
                                    <Button
                                      variant="outline"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      -
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => append("")}
                              >
                                + Add More
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="programmingLanguages"
                      render={() => {
                        const { fields, append, remove } = useFieldArray({
                          control: form.control,
                          name: "programmingLanguages",
                        });

                        return (
                          <FormItem>
                            <FormLabel>Programming Languages*</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {fields.map((field, index) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      {...form.register(
                                        `programmingLanguages.${index}`,
                                      )}
                                      placeholder="Enter a programming language"
                                    />
                                    <Button
                                      variant="outline"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      -
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => append("")}
                              >
                                + Add More
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      name="previousProgrammingExperience"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Do you have previous programming experience?
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <Button
                                variant={field.value ? "default" : "outline"}
                                type="button"
                                onClick={() => field.onChange(true)}
                              >
                                Yes
                              </Button>
                              <Button
                                variant={!field.value ? "default" : "outline"}
                                type="button"
                                onClick={() => field.onChange(false)}
                              >
                                No
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">Diversity Statement</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="essayQuestion1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question 1</FormLabel>
                          <FormDescription>
                            At TartanHacks, we believe that diverse
                            perspectives, backgrounds, and experiences are
                            crucial to building an environment where everyone is
                            empowered to bring their moonshot ideas to life. If
                            you have a unique background that you'd like to
                            share with us, please do so here! We'll prioritize
                            bringing you to TartanHacks.
                          </FormDescription>
                          <FormControl>
                            <Textarea className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">Portfolio</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Github URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attach Resume</FormLabel>
                          <FormControl>
                            <Input type="file" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="designPortfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Design Portfolio URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">Additional Information</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Restrictions</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="tshirtSize"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T-shirt Size</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessibilityNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accessibility Needs</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-xl font-bold">Travel Reimbursement</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="travelReimbursementAcknowledgement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Acknowledgement</FormLabel>
                            <FormDescription>
                              We will be providing travel reimbursements for a
                              select number of hackers this year! If interested,
                              please indicate. You must submit a project to
                              receive your reimbursement.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="travelReimbursementDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preference</FormLabel>
                          <FormDescription>
                            If you indicated that you would like to receive
                            travel reimbursement, what mode of transportation
                            would you prefer, and from where? (e.g. train from
                            NYC, flight from SFO, car from Ann Arbor)
                          </FormDescription>
                          <FormControl>
                            <Textarea className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xl font-bold">Consent and Agreements</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="codeOfConductAcknowledgement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Code of Conduct Acknowledgement
                            </FormLabel>
                            <FormDescription>
                              I agree to adhere to the
                              <a href="https://docs.google.com/document/d/1_fNz533Ryzw2pYhi9YJe9RC8LMglMvADdta5cexjInI/edit?usp=sharing">
                                TartanHacks Code of Conduct*
                              </a>
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="photoReleaseAcknowledgement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Photo Release Acknowledgement</FormLabel>
                            <FormDescription>placeholder</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="mlhCodeOfConductAcknowledgement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>MLH Code of Conduct Acknowledgement</FormLabel>
                            <FormDescription>
                              I have read and agree to the
                              <a href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md">
                                MLH Code of Conduct*
                              </a>
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="mlhTermsAndConditionsAcknowledgement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>MLH Terms and Conditions & Privacy Policy Acknowledgement</FormLabel>
                            <FormDescription>
                              I authorize you to share my application/registration information
                              with Major League Hacking for event administration,
                              ranking, and MLH administration in-line with the
                              <a href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md">
                                MLH Privacy Policy
                              </a>.
                              I further agree to the terms of both the
                              <a href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">
                                MLH Contest Terms and Conditions
                              </a> and the
                              <a href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md">
                                MLH Privacy Policy
                              </a>.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="mlhEmailSubscription"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>MLH Email Subscription</FormLabel>
                            <FormDescription>
                              I authorize MLH to send me occasional emails
                              about relevant events, career opportunities,
                              and community announcements.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" name="save">
                    Save
                  </Button>
                  <Button name="submit">Submit</Button>
                </div>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
