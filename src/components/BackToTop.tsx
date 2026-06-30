import { useState, useEffect } from 'react';
import { Affix, ActionIcon, Transition, rem } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={visible}>
        {(transitionStyles) => (
          <ActionIcon
            size="lg"
            variant="filled"
            style={transitionStyles}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <IconArrowUp size={18} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}
