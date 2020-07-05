# TODO List

## Routes In Progress:

| Method           | Endpoint                                                   | Progres     | Table                                           |
|:-----------------|:-----------------------------------------------------------|:-----------:|:-----------------------------------------------:|

| GET              | /api/collaborators                                         | DONE        | collaborators                                   |
| POST             | /api/collaborators                                         |             | collaborators                                   |
| GET              | /api/collaborators                                         | DONE        | collaborators                                   |
| DELETE           | /api/collaborators                                         |             | collaborators                                   |
| GET              | /api/students                                              | DONE        | students                                        |
| POST             | /api/students                                              |             | students                                        |
| GET              | /api/students/:id                                          | DONE        | students                                        |
| DELETE           | /api/students/:id                                          |             | students                                        |
| PUT              | /api/evaluations                                           |             | evaluations                                     |
| PUT              | /api/projects                                              |             | projects                                        |
| GET              | /api/projects/:projectId/attachments                       | DONE        | project_attachments                             |
| POST             | /api/projects/:projectId/attachments                       |             | project_attachments                             |
| GET              | /api/publications/:publicationId/attachments               |             | publications + attachments                      |
| POST             | /api/publications/:publicationId/attachments               |             | publications + attachments                      |

## Routes Finished:

| Method           | Endpoint                                                   | Progres     | Table                                           |
|:-----------------|:-----------------------------------------------------------|:-----------:|:-----------------------------------------------:|
| POST             | /api/auth/login                                            | DONE        |                                                 |
| POST             | /api/auth/logout                                           | DONE        |                                                 |
| POST             | /api/auth/register                                         | DONE        |                                                 |
| GET              | /api/activities                                            | DONE        | ativities                                       |
| POST             | /api/activities                                            | DONE        | ativities                                       |
| GET              | /api/activities/:id                                        | DONE        | ativities                                       |
| DELETE           | /api/activities/:id                                        | DONE        | ativities                                       |
| GET              | /api/attachments                                           | DONE        | attachments                                     |
| POST             | /api/attachments                                           | DONE        | attachments                                     |
| GET              | /api/attachments/:id                                       | DONE        | attachments                                     |   -- save files
| DELETE           | /api/attachments/:id                                       | DONE        | attachments                                     |
| GET              | /api/demands                                               | DONE        | demands                                         |
| POST             | /api/demands                                               | DONE        | demands                                         |
| PUT              | /api/demands                                               | DONE        | demands                                         |
| GET              | /api/demands/:id                                           | DONE        | demands                                         |
| DELETE           | /api/demands/:id                                           | DONE        | demands                                         |
| GET              | /api/disclosure-medias                                     | DONE        | disclosure-medias                               |
| POST             | /api/disclosure-medias                                     | DONE        | disclosure-medias                               |
| PUT              | /api/disclosure-medias                                     | DONE        | disclosure-medias                               |
| GET              | /api/disclosure-medias/:id                                 | DONE        | disclosure-medias                               |
| DELETE           | /api/disclosure-medias/:id                                 | DONE        | disclosure-medias                               |
| GET              | /api/evaluations                                           | DONE        | evaluations                                     |
| POST             | /api/evaluations                                           | DONE        | evaluations                                     |
| GET              | /api/evaluations/:id                                       | DONE        | evaluations                                     |
| DELETE           | /api/evaluations/:id                                       | DONE        | evaluations                                     |
| GET              | /api/events                                                | DONE        | events                                          |
| POST             | /api/events                                                | DONE        | events                                          |
| PUT              | /api/events                                                | DONE        | events                                          |
| GET              | /api/events/:id                                            | DONE        | events                                          |
| DELETE           | /api/events/:id                                            | DONE        | events                                          |
| GET              | /api/extension-lines                                       | DONE        | extension_lines                                 |
| POST             | /api/extension-lines                                       | DONE        | extension_lines                                 |
| PUT              | /api/extension-lines                                       | DONE        | extension_lines                                 |
| GET              | /api/extension-lines/:id                                   | DONE        | extension_lines                                 |
| DELETE           | /api/extension-lines/:id                                   | DONE        | extension_lines                                 |
| GET              | /api/future-development-plans                              | DONE        | future_development_plans                        |
| POST             | /api/future-development-plans                              | DONE        | future_development_plans                        |
| PUT              | /api/future-development-plans                              | DONE        | future_development_plans                        |
| GET              | /api/future-development-plans/:id                          | DONE        | future_development_plans                        |
| DELETE           | /api/future-development-plans/:id                          | DONE        | future_development_plans                        |
| GET              | /api/knowledge-areas                                       | DONE        | knowledge_areas                                 |
| POST             | /api/knowledge-areas                                       | DONE        | knowledge_areas                                 |
| PUT              | /api/knowledge-areas                                       | DONE        | knowledge_areas                                 |
| GET              | /api/knowledge-areas/:id                                   | DONE        | knowledge_areas                                 |
| DELETE           | /api/knowledge-areas/:id                                   | DONE        | knowledge_areas                                 |
| GET              | /api/partners                                              | DONE        | partners                                        |
| POST             | /api/partners                                              | DONE        | partners                                        |
| PUT              | /api/partners                                              | DONE        | partners                                        |
| GET              | /api/partners/:id                                          | DONE        | partners                                        |
| DELETE           | /api/partners/:id                                          | DONE        | partners                                        |
| GET              | /api/projects                                              | DONE        | projects                                        |
| POST             | /api/projects                                              | DONE        | projects                                        |
| GET              | /api/projects/:id                                          | DONE        | projects                                        |
| GET              | /api/projects/:projectId/demands                           | DONE        | demands                                         |
| POST             | /api/projects/:projectId/demands                           | DONE        | demands                                         |
| GET              | /api/projects/:projectId/disclosure-medias                 | DONE        | disclosure_medias                               |
| POST             | /api/projects/:projectId/disclosure-medias                 | DONE        | disclosure_medias                               |
| GET              | /api/projects/:projectId/evaluations                       | DONE        | evaluations                                     |
| GET              | /api/projects/:projectId/extension-lines                   | DONE        | project_extension_lines                         |
| POST             | /api/projects/:projectId/extension-lines                   | DONE        | project_extension_lines                         |
| PUT              | /api/projects/:projectId/extension-lines                   | DONE        | project_extension_lines                         |
| DELETE           | /api/projects/:projectId/extension-lines/:extensionLineId  | DONE        | project_extension_lines                         |
| GET              | /api/projects/:projectId/knowledge-areas                   | DONE        | project_knowledge_areas                         |
| POST             | /api/projects/:projectId/knowledge-areas                   | DONE        | project_knowledge_areas                         |
| PUT              | /api/projects/:projectId/knowledge-areas                   | DONE        | project_knowledge_areas                         |
| DELETE           | /api/projects/:projectId/knowledge-areas/:knowledgeAreaId  | DONE        | project_knowledge_areas                         |
| GET              | /api/projects/:projectId/human-resources                   | DONE        | project_human_resources + users                 |
| POST             | /api/projects/:projectId/human-resources                   | DONE        | project_human_resources + users                 |
| GET              | /api/projects/:projectId/human-resources/students          | DONE        | project_human_resources + users + students      |
| GET              | /api/projects/:projectId/human-resources/collaborators     | DONE        | project_human_resources + users + collaborators |
| DELETE           | /api/projects/:projectId/human-resources/:userId           | DONE        | project_human_resources + users                 |
| GET              | /api/projects/:projectId/partners                          | DONE        | partners                                        |
| POST             | /api/projects/:projectId/partners                          | DONE        | partners                                        |
| GET              | /api/projects/:projectId/publics                           | DONE        | project_publics                                 |
| POST             | /api/projects/:projectId/publics                           | DONE        | project_publics                                 |
| PUT              | /api/projects/:projectId/publics                           | DONE        | project_publics                                 |
| DELETE           | /api/projects/:projectId/publics/:publicId                 | DONE        | project_publics                                 |
| GET              | /api/projects/:projectId/targets                           | DONE        | targets                                         |
| POST             | /api/projects/:projectId/targets                           | DONE        | targets                                         |
| GET              | /api/projects/:projectId/theme-areas                       | DONE        | project_theme_areas                             |
| POST             | /api/projects/:projectId/theme-areas                       | DONE        | project_theme_areas                             |
| PUT              | /api/projects/:projectId/theme-areas                       | DONE        | project_theme_areas                             |
| DELETE           | /api/projects/:projectId/theme-areas/:themeAreaId          | DONE        | project_theme_areas                             |
| GET              | /api/publications                                          | DONE        | publications + attachments                      |
| POST             | /api/publications                                          | DONE        | publications + attachments                      |
| GET              | /api/publications/types                                    | DONE        | publications                                    |
| GET              | /api/publications/:id                                      | DONE        | publications + attachments                      |
| DELETE           | /api/publications/:id                                      | DONE        | publications + attachments                      |
| GET              | /api/publics                                               | DONE        | publics                                         |
| POST             | /api/publics                                               | DONE        | publics                                         |
| PUT              | /api/publics                                               | DONE        | publics                                         |
| GET              | /api/publics/:id                                           | DONE        | publics                                         |
| DELETE           | /api/publics/:id                                           | DONE        | publics                                         |
| GET              | /api/targets                                               | DONE        | targets                                         |
| POST             | /api/targets                                               | DONE        | targets                                         |
| GET              | /api/targets/age-ranges                                    | DONE        | targets                                         |
| GET              | /api/targets/:id                                           | DONE        | targets                                         |
| DELETE           | /api/targets/:id                                           | DONE        | targets                                         |
| GET              | /api/theme-areas                                           | DONE        | theme_areas                                     |
| POST             | /api/theme-areas                                           | DONE        | theme_areas                                     |
| PUT              | /api/theme-areas                                           | DONE        | theme_areas                                     |
| GET              | /api/theme-areas/:id                                       | DONE        | theme_areas                                     |
| DELETE           | /api/theme-areas/:id                                       | DONE        | theme_areas                                     |
| GET              | /api/users                                                 | DONE        | users                                           |
| POST             | /api/users                                                 | DONE        | users                                           |
| PUT              | /api/users                                                 | DONE        | users                                           |
| GET              | /api/users/:id                                             | DONE        | users                                           |
| POST             | /api/users/:id/activate                                    | DONE        | users                                           |
| POST             | /api/users/:id/desactivate                                 | DONE        | users                                           |
