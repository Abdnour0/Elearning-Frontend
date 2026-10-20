/**
 * Zen icon set — inline SVG, no icon webfont.
 *
 * `@mdi/font` ships a 394 kB woff2 (plus ~3.1 MB of legacy .eot/.ttf/.woff) and a
 * 408 kB stylesheet of ~7,000 class rules, of which this app uses 68. This
 * module keeps the ergonomic `<v-icon>` name call sites unchanged by
 * registering a custom Vuetify icon set under the `mdi` key. Vuetify resolves
 * `mdi-*` names through this set and renders an inline `<svg>`, so dropping the
 * font costs nothing at the call site.
 *
 * The map below is exhaustive and verified at generation time: it covers every
 * `mdi-*` string in the codebase plus every name Vuetify's own internal aliases
 * (`$close`, `$dropdown`, `$next`, ...) resolve to.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   npm run icons:generate
 */
import { h } from 'vue';
import {
  mdiAccount, mdiAccountCircleOutline, mdiAccountGroup, mdiAccountOutline,
  mdiAccountPlus, mdiAccountStar, mdiAccountTieOutline, mdiAlertCircle,
  mdiAlertCircleOutline, mdiAlertOutline, mdiAppleKeyboardCommand, mdiAppleKeyboardControl,
  mdiAppleKeyboardOption, mdiAppleKeyboardShift, mdiArrowDown, mdiArrowLeft,
  mdiArrowRight, mdiArrowUp, mdiBackburger, mdiBackspace,
  mdiBookOpenVariant, mdiBookshelf, mdiCached, mdiCalendar,
  mdiChartLine, mdiCheck, mdiCheckAll, mdiCheckCircle,
  mdiCheckCircleOutline, mdiCheckDecagram, mdiCheckboxBlankOutline, mdiCheckboxMarked,
  mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp,
  mdiCircle, mdiClipboardCheckOutline, mdiClose, mdiCloseCircle,
  mdiCloseCircleOutline, mdiCloudUpload, mdiDeleteOutline, mdiDownload,
  mdiDownloadOutline, mdiEmailOutline, mdiEye, mdiEyeOff,
  mdiEyeOffOutline, mdiEyedropper, mdiFile, mdiFileDocumentOutline,
  mdiFilePdfBox, mdiFullscreen, mdiFullscreenExit, mdiGithub,
  mdiHeadQuestionOutline, mdiHistory, mdiImage, mdiImageOutline,
  mdiInformation, mdiInformationOutline, mdiKeyboardReturn, mdiKeyboardSpace,
  mdiLayersOutline, mdiLinkedin, mdiLockCheckOutline, mdiLockOutline,
  mdiLogin, mdiLogoutVariant, mdiMagnify, mdiMenu,
  mdiMenuDown, mdiMenuRight, mdiMinus, mdiMinusBox,
  mdiPageFirst, mdiPageLast, mdiPalette, mdiPaperclip,
  mdiPause, mdiPencil, mdiPencilOutline, mdiPercentOutline,
  mdiPhoneOutline, mdiPlay, mdiPlayCircleOutline, mdiPlus,
  mdiPlusBox, mdiRadioboxBlank, mdiRadioboxMarked, mdiRefresh,
  mdiRocketLaunchOutline, mdiSchool, mdiSchoolOutline, mdiShieldCheckOutline,
  mdiShieldCrown, mdiShieldLockOutline, mdiStar, mdiStarHalfFull,
  mdiStarOutline, mdiText, mdiTextBoxOutline, mdiTimerOutline,
  mdiTrashCanOutline, mdiTrendingUp, mdiTwitter, mdiUnfoldMoreHorizontal,
  mdiVideoOffOutline, mdiViewDashboard, mdiVolumeHigh, mdiVolumeLow,
  mdiVolumeMedium, mdiVolumeVariantOff,
} from '@mdi/js';

/** MDI class name -> `@mdi/js` SVG path data. */
export const zenIconNames = {
  'mdi-account': mdiAccount,
  'mdi-account-circle-outline': mdiAccountCircleOutline,
  'mdi-account-group': mdiAccountGroup,
  'mdi-account-outline': mdiAccountOutline,
  'mdi-account-plus': mdiAccountPlus,
  'mdi-account-star': mdiAccountStar,
  'mdi-account-tie-outline': mdiAccountTieOutline,
  'mdi-alert-circle': mdiAlertCircle,
  'mdi-alert-circle-outline': mdiAlertCircleOutline,
  'mdi-alert-outline': mdiAlertOutline,
  'mdi-apple-keyboard-command': mdiAppleKeyboardCommand,
  'mdi-apple-keyboard-control': mdiAppleKeyboardControl,
  'mdi-apple-keyboard-option': mdiAppleKeyboardOption,
  'mdi-apple-keyboard-shift': mdiAppleKeyboardShift,
  'mdi-arrow-down': mdiArrowDown,
  'mdi-arrow-left': mdiArrowLeft,
  'mdi-arrow-right': mdiArrowRight,
  'mdi-arrow-up': mdiArrowUp,
  'mdi-backburger': mdiBackburger,
  'mdi-backspace': mdiBackspace,
  'mdi-book-open-variant': mdiBookOpenVariant,
  'mdi-bookshelf': mdiBookshelf,
  'mdi-cached': mdiCached,
  'mdi-calendar': mdiCalendar,
  'mdi-chart-line': mdiChartLine,
  'mdi-check': mdiCheck,
  'mdi-check-all': mdiCheckAll,
  'mdi-check-circle': mdiCheckCircle,
  'mdi-check-circle-outline': mdiCheckCircleOutline,
  'mdi-check-decagram': mdiCheckDecagram,
  'mdi-checkbox-blank-outline': mdiCheckboxBlankOutline,
  'mdi-checkbox-marked': mdiCheckboxMarked,
  'mdi-chevron-down': mdiChevronDown,
  'mdi-chevron-left': mdiChevronLeft,
  'mdi-chevron-right': mdiChevronRight,
  'mdi-chevron-up': mdiChevronUp,
  'mdi-circle': mdiCircle,
  'mdi-clipboard-check-outline': mdiClipboardCheckOutline,
  'mdi-close': mdiClose,
  'mdi-close-circle': mdiCloseCircle,
  'mdi-close-circle-outline': mdiCloseCircleOutline,
  'mdi-cloud-upload': mdiCloudUpload,
  'mdi-delete-outline': mdiDeleteOutline,
  'mdi-download': mdiDownload,
  'mdi-download-outline': mdiDownloadOutline,
  'mdi-email-outline': mdiEmailOutline,
  'mdi-eye': mdiEye,
  'mdi-eye-off': mdiEyeOff,
  'mdi-eye-off-outline': mdiEyeOffOutline,
  'mdi-eyedropper': mdiEyedropper,
  'mdi-file': mdiFile,
  'mdi-file-document-outline': mdiFileDocumentOutline,
  'mdi-file-pdf-box': mdiFilePdfBox,
  'mdi-fullscreen': mdiFullscreen,
  'mdi-fullscreen-exit': mdiFullscreenExit,
  'mdi-github': mdiGithub,
  'mdi-head-question-outline': mdiHeadQuestionOutline,
  'mdi-history': mdiHistory,
  'mdi-image': mdiImage,
  'mdi-image-outline': mdiImageOutline,
  'mdi-information': mdiInformation,
  'mdi-information-outline': mdiInformationOutline,
  'mdi-keyboard-return': mdiKeyboardReturn,
  'mdi-keyboard-space': mdiKeyboardSpace,
  'mdi-layers-outline': mdiLayersOutline,
  'mdi-linkedin': mdiLinkedin,
  'mdi-lock-check-outline': mdiLockCheckOutline,
  'mdi-lock-outline': mdiLockOutline,
  'mdi-login': mdiLogin,
  'mdi-logout-variant': mdiLogoutVariant,
  'mdi-magnify': mdiMagnify,
  'mdi-menu': mdiMenu,
  'mdi-menu-down': mdiMenuDown,
  'mdi-menu-right': mdiMenuRight,
  'mdi-minus': mdiMinus,
  'mdi-minus-box': mdiMinusBox,
  'mdi-page-first': mdiPageFirst,
  'mdi-page-last': mdiPageLast,
  'mdi-palette': mdiPalette,
  'mdi-paperclip': mdiPaperclip,
  'mdi-pause': mdiPause,
  'mdi-pencil': mdiPencil,
  'mdi-pencil-outline': mdiPencilOutline,
  'mdi-percent-outline': mdiPercentOutline,
  'mdi-phone-outline': mdiPhoneOutline,
  'mdi-play': mdiPlay,
  'mdi-play-circle-outline': mdiPlayCircleOutline,
  'mdi-plus': mdiPlus,
  'mdi-plus-box': mdiPlusBox,
  'mdi-radiobox-blank': mdiRadioboxBlank,
  'mdi-radiobox-marked': mdiRadioboxMarked,
  'mdi-refresh': mdiRefresh,
  'mdi-rocket-launch-outline': mdiRocketLaunchOutline,
  'mdi-school': mdiSchool,
  'mdi-school-outline': mdiSchoolOutline,
  'mdi-shield-check-outline': mdiShieldCheckOutline,
  'mdi-shield-crown': mdiShieldCrown,
  'mdi-shield-lock-outline': mdiShieldLockOutline,
  'mdi-star': mdiStar,
  'mdi-star-half-full': mdiStarHalfFull,
  'mdi-star-outline': mdiStarOutline,
  'mdi-text': mdiText,
  'mdi-text-box-outline': mdiTextBoxOutline,
  'mdi-timer-outline': mdiTimerOutline,
  'mdi-trash-can-outline': mdiTrashCanOutline,
  'mdi-trending-up': mdiTrendingUp,
  'mdi-twitter': mdiTwitter,
  'mdi-unfold-more-horizontal': mdiUnfoldMoreHorizontal,
  'mdi-video-off-outline': mdiVideoOffOutline,
  'mdi-view-dashboard': mdiViewDashboard,
  'mdi-volume-high': mdiVolumeHigh,
  'mdi-volume-low': mdiVolumeLow,
  'mdi-volume-medium': mdiVolumeMedium,
  'mdi-volume-variant-off': mdiVolumeVariantOff,
};

/**
 * Renders the same DOM shape Vuetify's built-in `VSvgIcon` produces
 * (`<i class="v-icon ..."><svg class="v-icon__svg" viewBox="0 0 24 24">`), so all
 * existing icon sizing, colour and alignment CSS keeps working untouched.
 */
const ZenSvgIcon = {
  name: 'ZenSvgIcon',
  inheritAttrs: false,
  props: {
    icon: { type: [String, Array], default: undefined },
    tag: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => h(props.tag, { ...attrs, style: null }, [
      h(
        'svg',
        {
          class: 'v-icon__svg',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          role: 'img',
          'aria-hidden': 'true',
        },
        [h('path', { d: zenIconNames[props.icon] ?? '' })],
      ),
    ]);
  },
};

export const zenIconSet = { component: ZenSvgIcon };
