import { searchAdvocates } from "../../../../services/advocates";

// NOTE: There are a few reasons to consider making
// the search endpoint a POST request instead of a GET. 
// The most significant involves logging. In many contexts
// URLs are logged automatically by load balancers, web logging framewroks and other
// tools, while post bodies are generally not. 
// Search endpoints in a medical context
// often receive parameters that could, if combined with identifying 
// information, constitute PHI (for example, a search for a particular sensitve condition)
//
// It's a minor detail, and reasonable people could disagree, but that's the reason for the choice

export async function POST(request: Request) {

    const payload = await request.json();

    if (!payload.query || typeof payload.query !== 'string') {
        return new Response('Invalid request', { status: 400 });
    }

    const advocates = await searchAdvocates(payload.query)

    return new Response(JSON.stringify({
        advocates
    }), { status: 200 });
}