import { PlatformColor } from 'react-native';
import InnerRenderHtml, {
  MixedStyleDeclaration,
  RenderHTMLProps,
} from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';

const onPress = (event: any, href: string) => {
  openInBrowser(href);
};

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

const renderersProps = {
  a: {
    onPress,
  },
};

const baseStyle: MixedStyleDeclaration = {
  fontSize: 17,
  lineHeight: 24,
  color: PlatformColor('label'),
};

const tagStyles: Record<string, MixedStyleDeclaration> = {
  a: {
    color: PlatformColor('link'),
    textDecorationLine: 'none',
  },
  p: {
    // backgroundColor: '#9f9',
  },
  pre: {
    backgroundColor: PlatformColor('secondarySystemBackground'),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  code: {
    fontSize: 15,
  },
};

export const RenderHtml = (props: RenderHTMLProps) => {
  return (
    <InnerRenderHtml
      renderersProps={renderersProps}
      tagsStyles={tagStyles}
      baseStyle={baseStyle}
      enableExperimentalMarginCollapsing
      {...props}
    />
  );
};
