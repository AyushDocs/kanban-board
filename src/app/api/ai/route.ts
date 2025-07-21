import { NextRequest, NextResponse } from 'next/server';

const AIPIPE_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjI0ZjIwMDQyNzVAZHMuc3R1ZHkuaWl0bS5hYy5pbiJ9.Z0qkomNxKr5VbwYHdhpV4ga2wMq47tVocKQPNdqglNk';

const PROMPT = `
You are an AI-powered daily events planner designed to create an optimized schedule for a user's day. Your goal is to generate a detailed, time-blocked plan that maximizes productivity while respecting constraints such as available time, task due dates, priorities, and estimated task durations. The user provides a list of tasks, their available time slots, and preferences for breaks or flexibility. Follow these guidelines to create the plan:

Tasks have the following attributes: ID, title, description, priority (high, medium, low), status (pending or completed), due date (optional, in ISO format), and estimated duration (in minutes).

Available time is provided as time slots (e.g., "9:00 AM - 12:00 PM, 2:00 PM - 6:00 PM").

User preferences may include desired break times, maximum continuous work period, or priority weighting (e.g., favor high-priority tasks).

Scheduling Rules:

Prioritize tasks based on:
Due date (earlier due dates first).
Priority (high > medium > low).
Estimated duration (fit shorter tasks in smaller time gaps if possible).
Ensure tasks fit within available time slots without overlapping.
Include breaks (default: 10 minutes every 90 minutes of work) unless specified otherwise.
Avoid scheduling tasks past their due date unless no other option exists (flag these as "urgent").
If a task cannot be scheduled, mark it as "unscheduled" with a reason (e.g., "insufficient time").

Output Format:

Provide a time-blocked schedule in a clear, readable format with:
Time range (e.g., "9:00 AM - 10:00 AM").
Task title and ID.
Brief description or notes (e.g., priority, due date).
Include a summary of unscheduled tasks, if any, with reasons.
List any assumptions made (e.g., default break duration).
Suggest adjustments if the schedule is tight (e.g., "Consider extending work hours to fit all high-priority tasks").
Constraints:
Do not schedule tasks during unavailable time slots.
Respect maximum continuous work periods (default: 2 hours before a break).
Account for current date and time to assess urgency (today is [CURRENT_DATE]).
If due dates are missing, assume tasks can be scheduled flexibly within the day.
Tone and Style:
Be concise, professional, and encouraging.
Use clear headings and bullet points for readability.
Offer practical advice to help the user follow the plan.

Example Input:
Tasks:

ID: T1, Title: "Prepare presentation", Description: "Slides for client meeting", Priority: High, Status: Pending, Due Date: 2025-05-16, Duration: 120 minutes

ID: T2, Title: "Email follow-ups", Description: "Respond to team", Priority: Medium, Status: Pending, Due Date: None, Duration: 30 minutes

ID: T3, Title: "Gym session", Description: "Cardio workout", Priority: Low, Status: Pending, Due Date: None, Duration: 60 minutes

Available Time: 9:00 AM - 12:00 PM, 2:00 PM - 5:00 PM

Preferences: 15-minute break every 2 hours, prioritize high-priority tasks

Example Output:

Daily Schedule for [CURRENT_DATE]

Time-Blocked Plan

9:00 AM - 11:00 AM: Prepare presentation (T1)

Notes: High priority, due tomorrow
11:00 AM - 11:15 AM: Break



11:15 AM - 11:45 AM: Email follow-ups (T2)




Notes: Medium priority, flexible



2:00 PM - 3:00 PM: Gym session (T3)




Notes: Low priority, flexible



3:00 PM - 3:15 PM: Break



3:15 PM - 5:00 PM: [Free time or buffer for unexpected tasks]

Unscheduled Tasks




None

Notes




All tasks fit within available time slots.



High-priority task (T1) scheduled early to meet tomorrow's deadline.



Consider starting earlier tomorrow if additional tasks arise.

User Input: [Replace with actual user-provided tasks, time slots, and preferences]

Generate a daily schedule based on the provided input, following the guidelines above. If no specific input is provided, assume a sample set of 3-5 tasks with varied priorities and durations, and create a plan for a typical workday (9:00 AM - 5:00 PM with a 1-hour lunch break from 12:00 PM - 1:00 PM).
`;

async function callOpenAI(prompt: string) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIPIPE_TOKEN}`,
    };
    const payload = {
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'You are a helpful daily planner.' },
            { role: 'user', content: PROMPT.replace('%d',prompt) },
        ],
        service_tier: 'flex',
        tools: [
            {
                type: "array",
                function: {
                    name: "return_todos_array",
                    description: "Return an array of todos with the required fields, adding a default duration (60 minutes) and a mustBeDoneBy field (dueDate if present, else end of workday).",
                    parameters: {
                        type: "object",
                        properties: {
                            todos: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        title: { type: "string" },
                                        description: { type: "string" },
                                        userEmail: { type: "string" },
                                        status: { type: "string", enum: ["pending", "completed"] },
                                        priority: { type: "string", enum: ["low", "medium", "high"] },
                                        dueDate: { type: "string", format: "date-time", nullable: true },
                                        createdAt: { type: "string", format: "date-time", nullable: true },
                                        updatedAt: { type: "string", format: "date-time", nullable: true },
                                        duration: { type: "number", description: "Estimated duration in minutes", default: 60 },
                                        mustBeDoneBy: { type: "string", format: "date-time", description: "When the task must be done by. Use dueDate if present, else end of workday (e.g., 17:00)." }
                                    },
                                    required: ["id", "title", "description", "userEmail", "status", "priority"],
                                },
                            },
                        },
                        required: ["todos"],
                    },
                },
            },
        ],
        temperature: 0.7,
    };
    try {
        const response = await fetch('https://aipipe.org/openai/v1/chat/completions', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('OpenAI API error: ' + response.statusText);
        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error('Error calling OpenAI API:', e.message);
            throw new Error('OpenAI API error: ' + e.message);
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const prompt = body.prompt || body.text;
        if (!prompt)
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        const result = await callOpenAI(prompt);
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process OpenAI request', details: error instanceof Error ? error.message : error }, { status: 500 });
    }
}
