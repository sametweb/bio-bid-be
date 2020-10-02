[![Maintainability](https://api.codeclimate.com/v1/badges/819afd4c021b7e39f08c/maintainability)](https://codeclimate.com/github/sametweb/bio-bid-be/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/819afd4c021b7e39f08c/test_coverage)](https://codeclimate.com/github/sametweb/bio-bid-be/test_coverage)

# API Documentation

#### Backend deployed [here](https://biobid.herokuapp.com) on Heroku. For front-end repository, see [bio-bid-fe repository](https://github.com/sametweb/bio-bid-fe).

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm test** to start server using testing environment

### Contributors

[Ben Rogers](https://www.github.com/thisbenrogers) | [Joshua Agins](https://www.github.com/jagins) | [Andrea Harris](https://www.github.com/aharris1012) | [Alston Garrett](https://www.github.com/neytorokx) | [David Shestopal](https://github.com/DavidShestopal) | [Josiah Roa](https://github.com/josiahroa18) | [Samet Mutevelli](https://github.com/sametweb) | [Brandon Fulmer](https://github.com/nobro777) | [Gavin Stahl](https://github.com/stahlgazer)

### Backend framework

We chose Apollo GraphQL because:

- Allows Web clients to request the exact details that it will consume at a given time. This leads to an increase to performance as well and prevents overfetching data.

- By using GraphQL it allows our API to be expanded on to include any number of features or to even make use to external APIs if needed in future releases.

## Client Repository

[Web Front-End](https://github.com/Lambda-School-Labs/bio-bid-fe) for details on the frontend of our project.

## Endpoints

#### Queries

| Query Name           | Access Control | Description                                                                                     |
| -------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| companies            | all users      | Returns an array of companies                                                                   |
| company              | all users      | Returns a a company that matches the `id` requested                                             |
| searchCompanies      | all users      | Returns an array of companies that match the `search` string requested (min 3 characters)       |
| pendingClaims        | all users      | Returns an array of claims `pending: true`                                                      |
| serviceItems         | all users      | Returns an array of services                                                                    |
| serviceItem          | all users      | Returns a service matching the `name` string requested                                          |
| searchServiceItems   | all users      | Returns an array of services that match the `search` string requested (min 3 characters)        |
| specialtyItems       | all users      | Returns an array of specialties                                                                 |
| specialtyItem        | all users      | Returns a specialty matching the `name` string requested                                        |
| searchSpecialtyItems | all users      | Returns an array of specialties that match the `search` string requested (min 3 characters)     |
| regions              | all users      | Returns an array of regions                                                                     |
| region               | all users      | Returns a region that matches the `name` requested                                              |
| searchRegions        | all users      | Returns an array of regions that cointain or match the `name` requested (min 3 characters)      |
| therapeutics         | all users      | Returns an array of therapeutics                                                                |
| therapeutic          | all users      | Returns a therapeutic that matches the `name` requested                                         |
| searchTherapeutics   | all users      | Returns an array of therapeutics that cointain or match the `name` requested (min 3 characters) |
| bids                 | all users      | Returns an array of bids                                                                        |
| studies              | all users      | Returns a an array of studies                                                                   |

#### Mutations

| Mutation Name       | Access Control | Description                                                                                                                             |
| ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| createCompany       | all users      | Creates a new company                                                                                                                   |
| updateCompany       | all users      | Updates the company details. Requires the company `id`                                                                                  |
| deleteCompany       | all users      | Deletes a company from the database. Requires the company `id`                                                                          |
| claimCompany        | all users      | Creates a new claim. Reequires `user` (sub field from Okta profile), `email`, `name`, and `company` (Company ID)                        |
| approveClaim        | all users      | Updates user's Okta profile and marks claim as `approved: true, pending: false`. Requires `id` (Claim ID)                               |
| denyClaim           | all users      | Updates claim as `pending: false`, since pending claim is already `approved: false`, it only stays in the database for future reference |
| createServiceItem   | all users      | Creates a new service                                                                                                                   |
| updateServiceItem   | all users      | Updates the service details. Requires the service `name`                                                                                |
| deleteServiceItem   | all users      | Deletes a service from the database. Requires the service `name`                                                                        |
| createRegion        | all users      | Creates a new region                                                                                                                    |
| updateRegion        | all users      | Updates the region details. Requires the region `name`                                                                                  |
| deleteRegion        | all users      | Deletes a region from the database. Requires the region `name`                                                                          |
| createTherapeutic   | all users      | Creates a new therapeutic                                                                                                               |
| updateTherapeutic   | all users      | Updates the therapeutic details. Requires the therapeutic `name`                                                                        |
| deleteTherapeutic   | all users      | Deletes a therapeutic from the database. Requires the therapeutic `name`                                                                |
| createSpecialtyItem | all users      | Creates a new specialty                                                                                                                 |
| updateSpecialtyItem | all users      | Updates the specialty details. Requires the specialty `name`                                                                            |
| deleteSpecialtyItem | all users      | Deletes a specialty from the database. Requires the specialty `name`                                                                    |
| createBid           | all users      | Creates a new bid                                                                                                                       |
| updateBid           | all users      | Updates the bid details                                                                                                                 |
| deleteBid           | all users      | Deletes a bid from the database. Requires the ID of the bid                                                                             |
| createStudy         | all users      | Creates a new study                                                                                                                     |
| updateStudy         | all users      | Updates study details                                                                                                                   |
| deleteStudy         | all users      | Deletes a study from the database. Requires the name of the study                                                                       |

## Data Model

### Note: ! means the field is required or will return a value of not NULL

#### Company

---

```
type Company {
  id: ID
  name: String!
  email: String
  phases: [Phase]
  logoURL: String
  website: String
  linkedin: String
  overview: String
  headquarters: String
  companySize: CompanySize
  services: [Service!]
  regions: [Region!]
  therapeutics: [Therapeutic!]
  studies: [Study!]
  bids: [Bid!]
}
```

#### Company Mutations

---

```
createCompany(
  name: String!
  email: String
  phases: [Phase]
  logoURL: String
  website: String
  linkedin: String
  overview: String
  headquarters: String
  companySize: CompanySize
  services: [ServiceInput]
  regions: [RegionInput]
  therapeutics: [TherapeuticInput]
): Company!

updateCompany(
  id: ID!
  updated_name: String
  updated_email: String
  updated_phases: [Phase]
  updated_logoURL: String
  updated_website: String
  updated_linkedin: String
  updated_overview: String
  updated_headquarters: String
  updated_companySize: CompanySize
  updated_services: [ServiceInput]
  updated_regions: [RegionInput]
  updated_therapeutics: [TherapeuticInput]
): Company!

input ServiceInput {
  name: String!
  specialties: [SpecialtyInput]
}

input SpecialtyInput {
  name: String!
  sub_specialties: [SpecialtyInput]
}

input RegionInput {
  name: String!
}

input TherapeuticInput {
  name: String!
}
```

#### Claim

---

```
type Claim {
  id: ID!
  user: String!
  email: String!
  name: String!
  company: Company!
  pending: Boolean!
  approved: Boolean!
}
```

#### Claim Mutations

---

```
type Mutation {
  claimCompany(user: String! email: String! name: String! company: ID!): Claim!
  approveClaim(id: ID!): Claim!
  denyClaim(id: ID!): Claim!
}
```

#### Service

---

```
type ServiceItem {
  id: ID!
  name: String!
}
```

#### Specialty

---

```
type SpecialtyItem {
  id: ID!
  name: String!
}
```

#### Region

---

```
type Region {
  id: ID
  name: String!
  companies: [Company]!
}
```

#### Therapeutic

---

```
type Therapeutic {
  id: ID
  name: String!
  companies: [Company]!
}
```

#### CompanySize

---

```
enum CompanySize { # https://developer.linkedin.com/docs/reference/company-size-codes
  A # Self-employed
  B # 1-10 employees
  C # 11-50 employees
  D # 51-200 employees
  E # 201-500 employees
  F # 501-1000 employees
  G # 1001-5000 employees
  H # 5001-10,000 employees
  I # 10,001+ employees
}
```

#### Phase

---

```
enum Phase {
  I
  II
  III
  IV
}
```

#### Bid

---

```
{
  id: ID!
  company: Company!
  bid_amount: Float!
  is_approved: Boolean!
  study: Study!
}
```

#### Study

---

```
{
  id: ID!
  name: String!
  area: String!
  phase: Int!
  status: String!
  company: Company!
}
```

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).
