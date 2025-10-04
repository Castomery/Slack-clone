import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat.js';
import PageLoader from '../components/PageLoader';
import "../styles/stream-chat-theme.css";
import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { UserButton } from '@clerk/clerk-react';
import { PlusIcon } from 'lucide-react';
import CreateChannelModal from '../components/CreateChannelModal';

const HomePage = () => {

  const [isCreatModalOpen, setIsCreateModalOpen] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSeatchParams] = useSearchParams();
  const {chatClient, isLoading, error} = useStreamChat();


  useEffect(()=>{
    if(chatClient){
      const channelId = searchParams.get("channel");
      if(channelId){
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  },[chatClient,searchParams]);

  if(error) return <p>Something went wrong...</p>
  if(isLoading || !chatClient) return <PageLoader/>

  return (
    <div className='chat-wrapper'>
      <Chat client={chatClient}>
        <div className='chat-container'>
          {/* Left */}
          <div className='str-chat__channel-list'>
            <div className='team-channel-list'>
              {/* Header */}
              <div className='team-channel-list__header gap-4'>
                <div className='brand-container'>
                  <img src="/logo.png" alt="Logo" className='brand-logo' />
                  <span className='brand-name'>Slack</span>
                </div>
                <div className='user-button-wrapper'>
                  <UserButton/>
                </div>
              </div>

              {/* Channels */}
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button onClick={()=> setIsCreateModalOpen(true)} className='create-channel-btn'>
                    <PlusIcon className='size-4'/>
                    <span>Create Channel</span>
                  </button>
                </div>
                {/* Channel list */}

              </div>
            </div>
          </div>

          {/* Right */}
          <div className="chat-main">
            <Channel channel={activeChannel}>
              <Window>
                {/*<CustomChannelHeader/>*/}
                <MessageList/>
                <MessageInput/>
              </Window>
              <Thread/>
            </Channel>
          </div>
        </div>

        {isCreatModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)}/>
        )}
      </Chat>
    </div>
  )
}

export default HomePage