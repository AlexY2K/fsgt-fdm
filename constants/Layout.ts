import { Platform } from 'react-native';

/** Padding bottom du ScrollView (évite le chevauchement avec la tab bar) */
export const SCROLL_PADDING_BOTTOM = Platform.OS === 'ios' ? 50 : 24;
