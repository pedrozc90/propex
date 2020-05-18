# TODO List

## Implementadas

1.  GET      /api/projects                                                  -- returna uma lista dos projectos cadastrados
2.  POST     /api/projects                                                  -- cria um novo projecto (somente campos necessarios).
3.  GET      /api/projects/:id                                              -- returna um projecto específico.
4.  DELETE   /api/projects/:id                                              -- apagar um projeto.

5.  GET      /api/projects/:id/disclosure-medias                            -- busca as medias do projeto.
6.  POST     /api/projects/:id/disclosure-medias                            -- salva/update as medias do projeto.
7.  DELETE   /api/projects/:id/disclosure-medias/:disclosureMediaId         -- delete uma media do projeto.

8.  GET      /api/projects/:id/extension-lines                              -- busca as linhas de extensão que o projeto se enquadra.
9.  POST     /api/projects/:id/extension-lines                              -- salva/update as linhas de extensão do projeto.

10. GET      /api/projects/:id/knowledge-areas                              -- busca as areas do conhecimento que o projeto se enquadra.
11. POST     /api/projects/:id/knowledge-areas                              -- salva/update/deleta as areas doo conhecimento do projeto.

12. GET      /api/projects/:id/publics                                      -- busca as informações do publicos que o projeto atende.
13. POST     /api/projects/:id/publics                                      -- atualiza as informacoes dos publicos do projecto.

14. GET      /api/projects/:id/targets                                      -- busca a lista de publico alvo do projeto.
15. POST     /api/projects/:id/targets                                      -- atualiza a lista de publico alvo do projecto.

16. GET      /api/projects/:id/students                                     -- busca a lista de studantes que fazem parte do projeto.

17. GET      /api/projects/:id/collaborators                                -- busca a lista collaboradores/professores que fazem parte do projeto.

## Não Implementadas

8.  GET     /api/projects/:id/event-presentations
9.  POST    /api/projects/:id/event-presentations
10. DELETE  /api/projects/:id/event-presentations/:eventId

11. GET     /api/projects/:id/demands
12. POST    /api/projects/:id/demands
13. DELETE  /api/projects/:id/demands/:demandId

14. GET     /api/projects/:id/future-plans
15. POST    /api/projects/:id/future-plans
16. DELETE  /api/projects/:id/future-plans/:futurePlanId

17. GET     /api/projects/:id/publications
18. POST    /api/projects/:id/publications
19. DELETE  /api/projects/:id/publications/:publicationId

20. GET     /api/projects/:id/activities
21. POST    /api/projects/:id/activities
22. DELETE  /api/projects/:id/activities/:activityId

23. GET     /api/projects/:id/attachments
24. POST    /api/projects/:id/attachments
25. DELETE  /api/projects/:id/attachments/:attachmentId

## Alexandre

2.  GET     /api/projects/:id/partners
3.  POST    /api/projects/:id/partners
4.  DELETE  /api/projects/:id/partners/:partnerId

5.  GET     /api/projects/:id/evaluations
6.  POST    /api/projects/:id/evaluations
6.  DELETE  /api/projects/:id/evaluations/:evaluationId

## Pedro

1.  POST    /api/projects/:id/students
2.  POST    /api/projects/:id/collaborators
