import type {StructureResolver} from 'sanity/structure'
import {ROUTES} from './schemaTypes/lib/routes'

/*
 * Same order as the Dr Geoff Cashion Studio: Site Settings, then the Pages
 * (a fixed set, one per route), then Clinics, the one list several pages
 * share. Everything else a page shows is edited inside that page.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              ROUTES.map((r) =>
                S.listItem()
                  .title(r.title)
                  .id(r.id)
                  .schemaType(r.type)
                  .child(S.document().schemaType(r.type).documentId(r.id).title(r.title)),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('clinic')
        .title('Clinics')
        .child(
          S.documentTypeList('clinic')
            .title('Clinics')
            .defaultOrdering([
              {field: 'doctor', direction: 'desc'},
              {field: 'region', direction: 'asc'},
              {field: 'order', direction: 'asc'},
            ]),
        ),
    ])
