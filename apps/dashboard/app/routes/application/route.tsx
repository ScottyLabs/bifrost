import { Card, CardContent, CardHeader, CardTitle } from "@bifrost/ui/ui/card";
import { Input } from "@bifrost/ui/ui/input";

import { useForm } from "@bifrost/lib/hooks/useForm";
import { applicationSchema } from "~/lib/schemas";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bifrost/ui/ui/form";
import { Button } from "@bifrost/ui/ui/button";

import { useFieldArray } from "react-hook-form";
import { useLoaderData } from "@remix-run/react";
import { data, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("info");
  return { user };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  const form = useForm({
    schema: applicationSchema,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      school: "",
      age: undefined,
      city: "",
      designPortfolio: "",
      dietaryRestrictions: "",
      essayQuestion1: "",
      ethnicity: undefined,
      gender: undefined,
      github: "",
      grade: undefined,
      major: "",
      linkedin: "",
      previousProgrammingExperience: false,
      programmingLanguages: [],
      relevantCoursework: [],
      resume: "",
      tshirtSize: undefined,
      travelReimbursementAcknowledgement: false,
      photoReleaseAcknowledgement: false,
      accessibilityNeeds: "",
      codeOfConductAcknowledgement: false,
      privacyPolicyAcknowledgement: false,
      termsAndConditionsAcknowledgement: false,
      travelReimbursementDetails: "",
    },
  });

  return (
    <main className="min-h-screen">
      <div className="container flex items-center justify-center my-48">
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm from-white/85 to-[#B1E2F6]/85 bg-gradient-to-br">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0372A1]">Application</CardTitle>
            <Separator className="my-4 bg-primary" />
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(console.log, console.error)}>
                <div className="text-xl font-bold">Personal Info</div>
                <div className="grid grid-cols-2 gap-2 m-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="name"
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
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School*</FormLabel>
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
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ethnicity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethnicity*</FormLabel>
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
                            you have a unique background that you’d like to
                            share with us, please do so here! We’ll prioritize
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
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="S">S</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="XL">XL</SelectItem>
                              <SelectItem value="XXL">XXL</SelectItem>
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
                            <FormDescription>placeholder</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="privacyPolicyAcknowledgement"
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
                              Privacy Policy Acknowledgement
                            </FormLabel>
                            <FormDescription>placeholder</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="termsAndConditionsAcknowledgement"
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
                              Terms and Conditions Acknowledgement
                            </FormLabel>
                            <FormDescription>placeholder</FormDescription>
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
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const draftData = form.getValues(); // Retrieve current form state
                      console.log("Saved Draft Data:", draftData);
                      // Add save-specific logic here (e.g., API call to save draft)
                    }}
                  >
                    Save
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
