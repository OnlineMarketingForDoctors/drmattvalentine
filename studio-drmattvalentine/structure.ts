import type {StructureResolver} from 'sanity/structure'
import {ROUTES} from './schemaTypes/lib/routes'

/*
 * Settings, stats and pages are fixed documents with fixed IDs, so there is
 * exactly one of each for the site to read. Clinics are shown per doctor because a
 * referring GP's first question is whether their patient sees Dr Valentine.
 */
const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type))

const ordered = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.documentTypeListItem(type)
    .title(title)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{field: 'order', direction: 'asc'}]),
    )

const clinicsFor = (S: Parameters<StructureResolver>[0], doctor: string, title: string) =>
  S.listItem()
    .title(title)
    .id(`clinics-${doctor}`)
    .child(
      S.documentList()
        .title(title)
        .apiVersion('2025-01-01')
        .filter('_type == "clinic" && region->doctor == $doctor')
        .params({doctor})
        .defaultOrdering([
          {field: 'region.order', direction: 'asc'},
          {field: 'order', direction: 'asc'},
        ]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'siteSettings', 'Site settings'),
      singleton(S, 'stats', 'Stats'),
      S.divider(),
      clinicsFor(S, 'valentine', 'Clinics — Dr Valentine'),
      clinicsFor(S, 'cashion', 'Clinics — Dr Cashion'),
      S.documentTypeListItem('clinicRegion')
        .title('Clinic regions')
        .child(
          S.documentTypeList('clinicRegion')
            .title('Clinic regions')
            .defaultOrdering([
              {field: 'doctor', direction: 'desc'},
              {field: 'order', direction: 'asc'},
            ]),
        ),
      S.divider(),
      ordered(S, 'careerMilestone', 'Career milestones'),
      ordered(S, 'commitment', 'Commitments'),
      ordered(S, 'appointmentStep', 'Appointment steps'),
      ordered(S, 'advantage', 'Procedure advantages'),
      S.divider(),
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              ROUTES.map((r) =>
                S.documentListItem()
                  .schemaType('page')
                  .id(r.id)
                  .child(S.document().schemaType('page').documentId(r.id)),
              ),
            ),
        ),
    ])
