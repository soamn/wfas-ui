"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import Button from "./common/Button";
import { FaCheckCircle, FaRocket, FaHandsHelping } from "react-icons/fa";
import {
  HiOutlineLightBulb,
  HiOutlineCog,
  HiOutlineShare,
} from "react-icons/hi";

// React Flow imports and components
import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
  Handle,
  Position,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import {
  SiClaude,
  SiGooglegemini,
  SiGooglesheets,
  SiOpenai,
} from "react-icons/si";
import { DiCodepen } from "react-icons/di";
import { BsSlack } from "react-icons/bs";

// --- React Flow Components (from original file) ---
const CenterBoxNode = () => (
  <div
    className="  relative
  p-10
  flex flex-col gap-4
  items-center justify-center
  min-w-55
  bg-linear-to-br from-white to-zinc-100
  dark:from-zinc-800 dark:to-zinc-900
  border border-zinc-200 dark:border-zinc-700
  rounded-3xl
  shadow-xl
  hover:shadow-2xl
  transition-all"
  >
    <Handle
      type="target"
      position={Position.Top}
      id="t-top"
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="t-bottom"
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Left}
      id="t-left"
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Right}
      id="t-right"
      className="opacity-0"
    />
    <Link href="/register">
      <Button
        text="Get Started"
        className="px-6 py-2.5 text-white font-medium rounded-lg transition-all active:scale-95"
      />
    </Link>
  </div>
);

const DNode = () => (
  <div
    className="w-16 h-16 bg-white dark:border-white border-2 dark:bg-zinc-800 flex items-center justify-center shadow-lg"
    style={{ borderRadius: "0 40px 40px 0" }}
  >
    <DiCodepen className="w-10 h-10 text-gray-700 dark:text-gray-300" />
    <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const BoxNode = ({ data }: any) => (
  <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-md border border-zinc-200 dark:border-zinc-700">
    {data.icon}
    <Handle
      type="source"
      position={data.handlePos || Position.Top}
      className="opacity-0"
    />
  </div>
);

const LongBoxNode = () => (
  <div className="w-40 h-24 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center shadow-xl border-2 border-zinc-200 dark:border-zinc-700">
    <span className="text-zinc-400 font-bold uppercase tracking-tighter text-xs">
      Processor
    </span>
    <Handle
      type="target"
      position={Position.Left}
      id="in-d"
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="ai-1"
      style={{ left: "25%" }}
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="ai-2"
      style={{ left: "50%" }}
      className="opacity-0"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="ai-3"
      style={{ left: "75%" }}
      className="opacity-0"
    />
    <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const ResultNode = () => (
  <div className="p-4 bg-zinc-900 dark:bg-zinc-700 text-white dark:text-gray-100 rounded-xl shadow-2xl flex items-center gap-3">
    <FaCheckCircle className="text-emerald-400" />
    <span className="text-sm font-medium">Result</span>
    <Handle type="target" position={Position.Left} className="opacity-0" />
  </div>
);

const nodeTypes = {
  centerBoxNode: CenterBoxNode,
  boxNode: BoxNode,
  longBox: LongBoxNode,
  dNode: DNode,
  resultNode: ResultNode,
};

const centerX = 1200;
const centerY = 200;
const offset = 800;

const initialNodes: Node[] = [
  {
    id: "center",
    type: "centerBoxNode",
    position: { x: centerX, y: centerY },
    data: {},
  },
  {
    id: "tg",
    type: "boxNode",
    position: { x: centerX + 0, y: centerY - 170 },
    data: {
      handlePos: Position.Bottom,
      icon: <FaTelegram className="w-8 h-8 text-blue-400" />,
    },
  },
  {
    id: "dc",
    type: "boxNode",
    position: { x: centerX + 200, y: centerY + 180 },
    data: {
      icon: <FaDiscord className="w-8 h-8 text-[#5865F2]" />,
      handlePos: Position.Top,
    },
  },
  {
    id: "x",
    type: "boxNode",
    position: { x: centerX - 200, y: centerY + 95 },
    data: {
      icon: <SiGooglesheets className="w-8 h-8 text-[#28B446]" />,
      handlePos: Position.Right,
    },
  },
  {
    id: "gh",
    type: "boxNode",
    position: { x: centerX + 350, y: centerY - 80 },
    data: {
      icon: <BsSlack className="w-8 h-8 text-[#4A154B]" />,
      handlePos: Position.Left,
    },
  },

  {
    id: "d-node",
    type: "dNode",
    position: { x: centerX + offset - 180, y: centerY - 90 },
    data: {},
  },
  {
    id: "l-box",
    type: "longBox",
    position: { x: centerX + offset + 10, y: centerY - 90 },
    data: {},
  },

  {
    id: "ai-1",
    type: "boxNode",
    position: { x: centerX + offset - 50, y: centerY + 120 },
    data: { icon: <SiOpenai className="w-6 h-6 dark:text-black" /> },
  },
  {
    id: "ai-2",
    type: "boxNode",
    position: { x: centerX + offset + 100, y: centerY + 120 },
    data: { icon: <SiClaude className="w-6 h-6 text-[#D37357]" /> },
  },
  {
    id: "ai-3",
    type: "boxNode",
    position: { x: centerX + offset + 200, y: centerY + 120 },
    data: { icon: <SiGooglegemini className="w-6 h-6 text-blue-500" /> },
  },

  {
    id: "result",
    type: "resultNode",
    position: { x: centerX + offset + 300, y: centerY + -50 },
    data: {},
  },
];

const edgeStyle = { stroke: "#cbd5e1", strokeWidth: 2, type: "smoothstep" };

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "tg",
    target: "center",
    targetHandle: "t-top",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e2",
    source: "dc",
    target: "center",
    targetHandle: "t-bottom",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e3",
    source: "x",
    target: "center",
    targetHandle: "t-left",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e4",
    source: "gh",
    target: "center",
    targetHandle: "t-right",
    animated: true,
    style: edgeStyle,
  },

  {
    id: "e-d",
    source: "d-node",
    target: "l-box",
    targetHandle: "in-d",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e-ai1",
    source: "ai-1",
    target: "l-box",
    targetHandle: "ai-1",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e-ai2",
    source: "ai-2",
    target: "l-box",
    targetHandle: "ai-2",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e-ai3",
    source: "ai-3",
    target: "l-box",
    targetHandle: "ai-3",
    animated: true,
    style: edgeStyle,
  },
  {
    id: "e-res",
    source: "l-box",
    target: "result",
    animated: true,
    style: edgeStyle,
  },
];

const FlowContent = () => {
  const { setViewport, getViewport } = useReactFlow();
  const [slideNumber, setSlideNumber] = useState(1);

  const slide = useCallback(
    (direction: "forward" | "back") => {
      const { x, zoom } = getViewport();
      const targetX = direction === "forward" ? x - offset : x + offset;
      setViewport({ x: targetX, y: -30, zoom }, { duration: 800 });
    },
    [getViewport, setViewport],
  );

  return (
    <>
      <Panel position="bottom-right" className="flex gap-2">
        {slideNumber !== 1 ? (
          <button
            onClick={() => {
              setSlideNumber(1);
              slide("back");
            }}
            className="bg-black text-white px-4 py-2 rounded-md dark:bg-zinc-700 dark:text-gray-100"
          >
            ←
          </button>
        ) : (
          <button
            onClick={() => {
              setSlideNumber(2);
              slide("forward");
            }}
            className="bg-black text-white px-4 py-2 rounded-md dark:bg-zinc-700 dark:text-gray-100"
          >
            →
          </button>
        )}
      </Panel>
      <Panel className="dark:text-gray-100">
        {slideNumber !== 1 ? (
          <span>Use Multiple Providers</span>
        ) : (
          <span>Get Started Now</span>
        )}
      </Panel>
    </>
  );
};

const LandingPage = () => {
  const reviews = [
    {
      text: "This automation platform has revolutionized our operations. Tasks that took hours now finish in minutes!",
      author: "Alice G., Tech Solutions Inc.",
      rating: 5,
    },
    {
      text: "Incredibly intuitive and powerful. The integrations are seamless, and support is fantastic.",
      author: "Bob R., Marketing Innovations",
      rating: 5,
    },
    {
      text: "A game-changer for our small business. We're more efficient and focused than ever.",
      author: "Carol S., E-commerce Ventures",
      rating: 4,
    },
    {
      text: "The best investment we've made this year. Our team loves it!",
      author: "David L., Financial Services",
      rating: 5,
    },
    {
      text: "Easy to set up and incredibly versatile. Highly recommend for any business looking to automate.",
      author: "Eve M., Creative Agency",
      rating: 4,
    },
    {
      text: "Our productivity soared after implementing this solution. Truly remarkable!",
      author: "Frank L., Operations Manager",
      rating: 5,
    },
    {
      text: "Fantastic platform for managing complex workflows. A must-have for any modern business.",
      author: "Grace H., Project Lead",
      rating: 5,
    },
    {
      text: "Simplified our onboarding process immensely. Very happy with the results.",
      author: "Heidi N., HR Department",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 md:py-32">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Automate. Simplify. Grow.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
          Streamline your tasks and boost productivity with powerful workflow
          automation.
        </p>
        <Link href="/register" passHref>
          <Button
            text="Get Started - It's Free!"
            className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </section>

      <section className="py-16 px-4 bg-white dark:bg-zinc-800 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          See How It Works!
        </h2>
        <div className="w-3xl h-110 overflow-hidden rounded-3xl border-4 border-black dark:border-white mx-auto shadow-xl ">
          <ReactFlow
            proOptions={{ hideAttribution: true }}
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            defaultViewport={{ x: -900, y: -100, zoom: 1 }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={10}
              className="dark:bg-zinc-900"
            />
            <FlowContent />
          </ReactFlow>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Our Workflow Automation?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <FaRocket className="text-blue-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Boost Efficiency</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Eliminate manual tasks and automate repetitive processes to save
              time and reduce errors.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <HiOutlineLightBulb className="text-green-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Integrations</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Connect seamlessly with your favorite apps and services to create
              powerful, interconnected workflows.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <HiOutlineCog className="text-purple-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Customizable Workflows
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Design and tailor workflows to fit your unique business needs with
              our intuitive drag-and-drop interface.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <FaHandsHelping className="text-red-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Enhanced Collaboration
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Improve team collaboration by automating communication and task
              assignments within workflows.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <FaCheckCircle className="text-yellow-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reliable Execution</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Ensure tasks are completed accurately and on time, every time,
              with robust and dependable automation.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-100 dark:bg-zinc-700">
            <HiOutlineShare className="text-teal-500 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Scalable Solutions</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Grow your automation as your business expands, with a platform
              designed for scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Reviews Section - VERTICAL GRID */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-zinc-950">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="relative mx-auto max-w-4xl h-[450px] overflow-hidden group">
          {/* Gradient mask for fading effect */}
          <div
            className="absolute inset-0 z-10 pointer-events-none
                        bg-gradient-to-b from-gray-100 dark:from-zinc-950 via-transparent to-gray-100 dark:to-zinc-950"
          ></div>

          <div className="absolute inset-0 flex flex-col justify-around animate-vertical-scroll">
            {[...reviews, ...reviews].map(
              (
                review,
                index, // Duplicate reviews twice for seamless loop
              ) => (
                <div
                  key={index}
                  className="flex-none p-6 mx-auto w-full sm:w-11/12 md:w-full lg:w-full
                           bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700
                           mb-4" // Added margin-bottom to separate reviews
                >
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-left">
                    &quot;{review.text}&quot;
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-left">
                    - {review.author}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
