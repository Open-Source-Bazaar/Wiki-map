import { Icon, IconProps } from 'idea-react';
import { FC } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

export type IconButtonProps = Omit<ButtonProps, 'name' | 'size'> &
    Pick<IconProps, 'name' | 'size'>;

export const IconButton: FC<IconButtonProps> = ({
    className = '',
    style,
    name,
    size = 2.5,
    ...props
}) => (
    <Button
        className={`d-flex justify-content-center align-items-center ${className}`}
        style={{
            width: `${size}rem`,
            height: `${size}rem`,
            ...style
        }}
        {...props}
    >
        <Icon name={name} size={size - 1.5} />
    </Button>
);

export const FloatIconButton: FC<IconButtonProps> = ({
    className = 'position-fixed bottom-0 end-0 p-3',
    style,
    ...props
}) => (
    <div {...{ className, style }}>
        <IconButton className="rounded-circle" {...props} />
    </div>
);
