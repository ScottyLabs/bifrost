/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getUser"];
        put: operations["updateUser"];
        post?: never;
        delete: operations["deleteUser"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/teams/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getTeam"];
        put: operations["updateTeam"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/teams/{id}/leader/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["changeLeader"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/applications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get user's application
         * @description Retrieves the current user's application
         */
        get: operations["getApplication"];
        /**
         * Update draft application
         * @description Updates an existing application in DRAFT status
         */
        put: operations["updateApplication"];
        /**
         * Create new application
         * @description Creates a new application in DRAFT status
         */
        post: operations["createApplication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook/registration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["handleRegistrationWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createTeam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/teams/{id}/members/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addMember"];
        delete: operations["removeMember"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/applications/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit application
         * @description Submits a DRAFT application for review
         */
        post: operations["submitApplication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCurrentUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/external/{externalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getUserByExternalId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Application: {
            /** Format: uuid */
            id: string;
            user: components["schemas"]["User"];
            name: string;
            email: string;
            phone: string;
            school: string;
            /** @enum {string} */
            grade: "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR" | "GRADUATE" | "OTHER";
            /** Format: int32 */
            age: number;
            /** @enum {string} */
            gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
            /** @enum {string} */
            ethnicity: "WHITE" | "BLACK" | "ASIAN" | "HISPANIC" | "NATIVE_AMERICAN" | "PACIFIC_ISLANDER" | "OTHER" | "PREFER_NOT_TO_SAY";
            city: string;
            major: string;
            relevantCoursework: string[];
            programmingLanguages: string[];
            previousProgrammingExperience: boolean;
            essayQuestion1: string;
            githubUrl: string;
            linkedinUrl: string;
            resumeUrl: string;
            designPortfolioUrl?: string;
            dietaryRestrictions?: string;
            /** @enum {string} */
            tshirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
            accessibilityNeeds?: string;
            travelReimbursementAcknowledgement: boolean;
            travelReimbursementDetails?: string;
            codeOfConductAcknowledgement: boolean;
            privacyPolicyAcknowledgement: boolean;
            termsAndConditionsAcknowledgement: boolean;
            photoReleaseAcknowledgement: boolean;
            /** @enum {string} */
            status: "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WAITLISTED" | "WITHDRAWN";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        Team: {
            /** Format: uuid */
            id: string;
            name: string;
            description: string;
            leader: components["schemas"]["User"];
            members: components["schemas"]["User"][];
            isOpen: boolean;
            /** @enum {string} */
            status: "ACTIVE" | "LOCKED" | "ARCHIVED";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            open?: boolean;
        };
        User: {
            /** Format: uuid */
            id: string;
            externalId: string;
            /** @enum {string} */
            status: "UNVERIFIED" | "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
            team?: components["schemas"]["Team"];
            accessLevels: ("PARTICIPANT" | "MENTOR" | "SPONSOR" | "JUDGE" | "ORGANIZER" | "ADMIN")[];
            application?: components["schemas"]["Application"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateTeamRequest: {
            name?: string;
            description?: string;
            isOpen?: boolean;
        };
        ApplicationRequest: {
            name: string;
            email: string;
            phone: string;
            school: string;
            /** @enum {string} */
            grade: "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR" | "GRADUATE" | "OTHER";
            /** Format: int32 */
            age: number;
            /** @enum {string} */
            gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
            /** @enum {string} */
            ethnicity: "WHITE" | "BLACK" | "ASIAN" | "HISPANIC" | "NATIVE_AMERICAN" | "PACIFIC_ISLANDER" | "OTHER" | "PREFER_NOT_TO_SAY";
            city: string;
            major: string;
            relevantCoursework: string[];
            programmingLanguages: string[];
            previousProgrammingExperience: boolean;
            essayQuestion1: string;
            githubUrl: string;
            linkedinUrl: string;
            resumeUrl: string;
            designPortfolioUrl?: string;
            dietaryRestrictions?: string;
            /** @enum {string} */
            tshirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
            accessibilityNeeds?: string;
            travelReimbursementAcknowledgement: boolean;
            travelReimbursementDetails?: string;
            codeOfConductAcknowledgement: boolean;
            privacyPolicyAcknowledgement: boolean;
            termsAndConditionsAcknowledgement: boolean;
            photoReleaseAcknowledgement: boolean;
        };
        RegistrationWebhookPayload: {
            userId: string;
        };
        CreateTeamRequest: {
            name: string;
            description: string;
            /** Format: uuid */
            leaderId: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["User"];
                };
            };
        };
    };
    updateUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["User"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["User"];
                };
            };
        };
    };
    deleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getTeam: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    updateTeam: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeamRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    changeLeader: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    getApplication: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Application found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description No application found for user */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
        };
    };
    updateApplication: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplicationRequest"];
            };
        };
        responses: {
            /** @description Application updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description Application not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description Application is not in DRAFT status */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
        };
    };
    createApplication: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplicationRequest"];
            };
        };
        responses: {
            /** @description Application created successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description Application already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
        };
    };
    handleRegistrationWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegistrationWebhookPayload"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    createUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["User"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["User"];
                };
            };
        };
    };
    createTeam: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTeamRequest"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    addMember: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    removeMember: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Team"];
                };
            };
        };
    };
    submitApplication: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Application submitted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description Application not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
            /** @description Application is not in DRAFT status */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["Application"];
                };
            };
        };
    };
    getCurrentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["User"];
                };
            };
        };
    };
    getUserByExternalId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                externalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["User"];
                };
            };
        };
    };
}
