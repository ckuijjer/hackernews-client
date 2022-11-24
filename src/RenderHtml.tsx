import { PlatformColor } from 'react-native';
import InnerRenderHtml, {
  MixedStyleDeclaration,
  RenderHTMLProps,
} from 'react-native-render-html';

import { openInBrowser } from './openInBrowser';

const renderersProps = {
  a: {
    onPress: (event: any, href: string) => openInBrowser(href),
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
