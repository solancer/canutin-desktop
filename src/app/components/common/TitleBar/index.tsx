import React, { useState } from 'react';
import { ipcRenderer, shell } from 'electron';
import styled from 'styled-components';

import { ReactComponent as Icon } from '@assets/icons/CanutinIcon.svg';
import { ReactComponent as IconMinimize } from '@assets/icons/windowControls/Minimize.svg';
import { ReactComponent as IconMaximize } from '@assets/icons/windowControls/Maximize.svg';
import { ReactComponent as IconMaximized } from '@assets/icons/windowControls/Maximized.svg';
import { ReactComponent as IconClose } from '@assets/icons/windowControls/Close.svg';

import { container, icon, windowControls, minimize, maximize, close } from './styles';
import { WINDOW_CONTROL } from '@constants/events';
import { WindowControlEnum } from '@appConstants/misc';

const Container = styled.div`
  ${container}
`;
const CanutinIcon = styled(Icon)`
  ${icon}
`;
const WindowControls = styled.nav`
  ${windowControls}
`;
const Minimize = styled.button`
  ${minimize}
`;
const Maximize = styled.button`
  ${maximize}
`;
const Close = styled.button`
  ${close}
`;

const TitleBar = () => {
  const isMacOs = process.platform === 'darwin';
  const [isMaximized, setIsMaximized] = useState(false);

  const windowControl = (action: WindowControlEnum) => {
    WindowControlEnum.MAXIMIZE && setIsMaximized(!isMaximized);
    ipcRenderer.send(WINDOW_CONTROL, action);
  };

  return (
    <Container isMacOs={isMacOs}>
      <CanutinIcon onClick={() => shell.openExternal('https://canutin.com')} />
      {!isMacOs && (
        <WindowControls>
          <Minimize onClick={() => windowControl(WindowControlEnum.MINIMIZE)}>
            <IconMinimize />
          </Minimize>
          <Maximize onClick={() => windowControl(WindowControlEnum.MAXIMIZE)}>
            {isMaximized ? <IconMaximized /> : <IconMaximize />}
          </Maximize>
          <Close onClick={() => windowControl(WindowControlEnum.CLOSE)}>
            <IconClose />
          </Close>
        </WindowControls>
      )}
    </Container>
  );
};

export default TitleBar;
