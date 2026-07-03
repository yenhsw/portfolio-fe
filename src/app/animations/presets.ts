// ============================================================
// ANIMATION PRESETS
// Reusable animation functions for Angular
// ============================================================

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  query,
  stagger,
  animation,
  AnimationTriggerMetadata,
} from '@angular/animations';

// ============================================================
// FADE ANIMATIONS
// ============================================================

export const fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate('{{ duration }} {{ easing }}', style({ opacity: 1 })),
]);

export const fadeOutAnimation = animation([
  animate('{{ duration }} {{ easing }}', style({ opacity: 0 })),
]);

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0 })),
  ]),
]);

export const fadeInSlow: AnimationTriggerMetadata = trigger('fadeInSlow', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('400ms ease-in', style({ opacity: 0 })),
  ]),
]);

export const fadeInFast: AnimationTriggerMetadata = trigger('fadeInFast', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('100ms ease-in', style({ opacity: 0 })),
  ]),
]);

// ============================================================
// SLIDE ANIMATIONS
// ============================================================

export const slideInUp: AnimationTriggerMetadata = trigger('slideInUp', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(30px)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'translateY(-30px)' })
    ),
  ]),
]);

export const slideInDown: AnimationTriggerMetadata = trigger('slideInDown', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-30px)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'translateY(30px)' })
    ),
  ]),
]);

export const slideInLeft: AnimationTriggerMetadata = trigger('slideInLeft', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-30px)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateX(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'translateX(30px)' })
    ),
  ]),
]);

export const slideInRight: AnimationTriggerMetadata = trigger('slideInRight', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(30px)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateX(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'translateX(-30px)' })
    ),
  ]),
]);

// ============================================================
// SCALE ANIMATIONS
// ============================================================

export const scaleIn: AnimationTriggerMetadata = trigger('scaleIn', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.9)',
    }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'scale(0.9)' })
    ),
  ]),
]);

export const scaleInUp: AnimationTriggerMetadata = trigger('scaleInUp', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.8) translateY(20px)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' })
    ),
  ]),
]);

// ============================================================
// ROTATE ANIMATIONS
// ============================================================

export const rotateIn: AnimationTriggerMetadata = trigger('rotateIn', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'rotate(-10deg) scale(0.95)',
    }),
    animate(
      '400ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'rotate(0) scale(1)' })
    ),
  ]),
]);

// ============================================================
// STAGGER ANIMATIONS (for lists)
// ============================================================

export const staggerFadeInUp: AnimationTriggerMetadata = trigger('staggerFadeInUp', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger('50ms', [
          animate(
            '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

export const staggerSlideIn: AnimationTriggerMetadata = trigger('staggerSlideIn', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        stagger('80ms', [
          animate(
            '400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

export const staggerScaleIn: AnimationTriggerMetadata = trigger('staggerScaleIn', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        stagger('100ms', [
          animate(
            '300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

// ============================================================
// EXPAND/COLLAPSE ANIMATIONS
// ============================================================

export const expandCollapse: AnimationTriggerMetadata = trigger('expandCollapse', [
  state('collapsed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
  state('expanded', style({ height: '*', opacity: 1 })),
  transition('collapsed <=> expanded', [
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'),
  ]),
]);

export const expandCollapseHeight: AnimationTriggerMetadata = trigger(
  'expandCollapseHeight',
  [
    transition(':enter', [
      style({ height: 0, opacity: 0 }),
      animate('300ms ease-out', style({ height: '*', opacity: 1 })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ height: 0, opacity: 0 })),
    ]),
  ]
);

// ============================================================
// HOVER ANIMATIONS
// ============================================================

export const hoverScale: AnimationTriggerMetadata = trigger('hoverScale', [
  state('default', style({ transform: 'scale(1)' })),
  state('hovered', style({ transform: 'scale(1.05)' })),
  transition('default <=> hovered', [
    animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'),
  ]),
]);

export const hoverGlow: AnimationTriggerMetadata = trigger('hoverGlow', [
  state('default', style({})),
  state('hovered', style({})),
  transition('default <=> hovered', [
    animate('300ms ease-out'),
  ]),
]);

// ============================================================
// ROUTE ANIMATIONS
// ============================================================

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        animate(
          '200ms ease-out',
          style({
            opacity: 0,
            transform: 'translateY(-20px)',
          })
        ),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

// ============================================================
// TYPING ANIMATION
// ============================================================

export const typingAnimation = trigger('typingAnimation', [
  transition(':enter', [
    style({ width: 0 }),
    animate('{{ duration }}ms steps({{ steps }})', style({ width: '{{ width }}' })),
  ]),
]);

// ============================================================
// COUNTER ANIMATION
// ============================================================

export const counterAnimation = trigger('counterAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate(
      '500ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
]);

// ============================================================
// FLIP ANIMATIONS
// ============================================================

export const flipIn: AnimationTriggerMetadata = trigger('flipIn', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'perspective(400px) rotateX(90deg)',
    }),
    animate(
      '600ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({
        opacity: 1,
        transform: 'perspective(400px) rotateX(0)',
      })
    ),
  ]),
]);

// ============================================================
// BOUNCE ANIMATIONS
// ============================================================

export const bounce: AnimationTriggerMetadata = trigger('bounce', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate(
      '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ transform: 'translateY(0)' })
    ),
  ]),
]);

// ============================================================
// PULSE ANIMATION
// ============================================================

export const pulse: AnimationTriggerMetadata = trigger('pulse', [
  transition(':enter', [
    style({ transform: 'scale(0)' }),
    animate(
      '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ transform: 'scale(1)' })
    ),
  ]),
  state(
    'pulsing',
    style({
      transform: 'scale(1.05)',
    })
  ),
  transition('* => pulsing', [
    animate(
      '200ms ease-out',
      style({ transform: 'scale(1.05)' })
    ),
  ]),
]);

// ============================================================
// LIST ANIMATIONS
// ============================================================

export const listAnimation: AnimationTriggerMetadata = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        stagger(100, [
          animate(
            '400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        stagger(50, [
          animate(
            '200ms ease-in',
            style({ opacity: 0, transform: 'translateX(30px)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);
