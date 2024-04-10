import React, { useEffect, useState } from 'react';
import { RiTicketLine } from 'react-icons/ri';
import { FaCogs, FaMap, FaDesktop, FaUser } from 'react-icons/fa';

const CardTicket = (props) => {
  const { ticket, totalTickets, text } = props;

  let statusClass = '';
  let icon = null;

  switch (ticket) {
    case 'pending':
      statusClass = 'bg-yellow-500/10 text-yellow-500';
      icon = <FaCogs className="text-4xl" />;
      break;
    case 'inProcess':
      statusClass = 'bg-blue-500/10 text-blue-500';
      icon = <FaDesktop className="text-4xl" />;
      break;
    case 'close':
      statusClass = 'bg-green-500/10 text-green-500';
      icon = <FaMap className="text-4xl" />;
      break;
    case 'total':
      statusClass = 'bg-pink-500/10 text-pink-500';
      icon = <FaUser className="text-4xl" />;
      break;
    default:
      statusClass = 'bg-secondary-100';
      icon = <RiTicketLine className="text-4xl" />;
      break;
  }

  return (
    <div className={`p-8 rounded-xl ${statusClass}`}>
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
        <div></div>
      </div>
      <div>
        <h1 className="text-4xl text-black font-bold mb-4">{totalTickets}</h1>
        <p className="text-black">{text}</p>
      </div>
      <hr className="border border-dashed border-gray-500/50 my-4" />
    </div>
  );
};

export default CardTicket;
