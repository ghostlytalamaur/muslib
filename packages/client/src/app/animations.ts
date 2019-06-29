import {
  animate, AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';

// export const fadeAnimation = trigger('fadeAnimation', [
//   transition('* => *', [
//     query(':enter', [style({ opacity: 0 })], { optional: true }),
//     query(
//       ':leave',
//       [
//         style({ opacity: 1 }),
//         animate('0.1s 0s ease-in-out', style({ opacity: 0 }))
//       ],
//       { optional: true }
//     ),
//     query(
//       ':enter',
//       [
//         style({ opacity: 0 }),
//         animate('0.1s 0s ease-in-out', style({ opacity: 1 }))
//       ],
//       { optional: true }
//     )
//   ])
// ]);
//
export const routerAnimation: AnimationTriggerMetadata = trigger('routerAnimation', [
  transition('* <=> *', [
    group([
      query(
        ':enter, :leave',
        style({
          position: 'fixed'
        }),
        { optional: true }
      ),
      query(
        ':enter',
        [
          // set initial style
          style({
            opacity: 0
          }),
          animate(
            '300ms ease-in-out',
            style({
              opacity: 1
            })
          )
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({
            opacity: 1
          }),
          animate(
            '300ms ease-in-out',
            style({
              opacity: 0
            })
          )
        ],
        { optional: true }
      )
    ])
  ])
]);
