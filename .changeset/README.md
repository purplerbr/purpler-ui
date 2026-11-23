# Changesets

Toda mudança em `packages/tokens` ou `packages/ui` precisa de um changeset (o CI confere no PR):

```sh
yarn changeset
```

Para publicar, um PR de release roda `yarn changeset version` (consome os changesets, sobe as versões e escreve o `CHANGELOG.md`). Depois do merge em `main`, o workflow `release` publica no GitHub Packages as versões que ainda não existem lá.
