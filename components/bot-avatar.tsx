import { Avatar, AvatarImage } from '@/components/ui/avatar'


export const BotAvatar = () => {
    return (
        <Avatar className='h-8'>
            <AvatarImage className='p-1' src='/logo.jpg' />

        </Avatar>
    )
}