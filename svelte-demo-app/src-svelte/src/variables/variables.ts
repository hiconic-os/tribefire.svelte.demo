interface UnitValue {
  value: number;
  units: string;
}

interface AppVariables {
  breakpointPaperView: UnitValue;
  breakpointTwoPaperView: UnitValue;
  breakpointTasksAsColumns: UnitValue;
  floatingPaperMenuMargin: UnitValue;
  floatingPaperHorzMargins: UnitValue;
  floatingPaperVertMargins: UnitValue;
  fontFamily: string,
  gridTaskSize: UnitValue;
  gridTaskSpacing: UnitValue;
  mainLangMenuWidth: UnitValue;
  maxPaperWidth: UnitValue;
  mainMenuWidth: UnitValue;
  paperHorzPadding: UnitValue;
  paperLangMenuSpacing: UnitValue;
  paperMenuSpacing: UnitValue;
  safeAreaInsetLeft: UnitValue;
  safeAreaInsetRight: UnitValue;
  topBarHeight: UnitValue;
  // transitions
  defaultTransition: string;
  // colors
  bodyBgColor: string;
  bodyContrastColor: string;
  paperBgColor: string;
  primaryColor: string;
  primaryColorRgb: string;
  primaryColorContrast: string;
  primaryColorContrastRgb: string;
  primaryColorShade: string;
  primaryColorTint: string;
}

const variables: AppVariables = {
  breakpointPaperView: {
    value: 860,
    units: 'px',
  },
  breakpointTwoPaperView: {
    value: 1200,
    units: 'px',
  },
  breakpointTasksAsColumns: {
    value: 1600,
    units: 'px',
  },
  floatingPaperMenuMargin: {
    value: 0,
    units: 'px',
  },
  floatingPaperHorzMargins: {
    value: 0,
    units: 'px',
  },
  floatingPaperVertMargins: {
    value: 0,
    units: 'px',
  },
  fontFamily: `'Libre Franklin', sans-serif`,
  gridTaskSize: {
    value: 43,
    units: 'px',
  },
  gridTaskSpacing: {
    value: 10,
    units: 'px',
  },
  mainLangMenuWidth: {
    value: 70,
    units: 'px',
  },
  mainMenuWidth: {
    value: 80,
    units: 'px',
  },
  topBarHeight: {
    value: 45,
    units: 'px',
  },
  maxPaperWidth: {
    value: 1320,
    units: 'px',
  },
  paperHorzPadding: {
    value: 24,
    units: 'px',
  },
  paperLangMenuSpacing: {
    value: 0,
    units: 'px',
  },
  paperMenuSpacing: {
    value: 24,
    units: 'px',
  },
  safeAreaInsetLeft: {
    value: 0,
    units: 'px',
  },
  safeAreaInsetRight: {
    value: 0,
    units: 'px',
  },

  // transitions
  defaultTransition: '150ms ease-out',

  // colors
  bodyBgColor: '#000000',
  bodyContrastColor: '#707070',
  paperBgColor: '#fff',
  primaryColor: '#FFA700',
  primaryColorRgb: '255,167,0',
  primaryColorContrast: '#ffffff',
  primaryColorContrastRgb: '255,255,255',
  primaryColorShade: '#996400',
  primaryColorTint: '#ffca66',
}

export default variables;
