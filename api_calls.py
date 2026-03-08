from ss_prompts import CHATBOT_PROMPT, build_safety_prompt

# For the checklist
intake_data = {
    "has_children": "two children, ages 4 and 7",
    "finances": "limited, no independent bank account",
    "has_id": "no",
    "trusted_contact": "yes, a sister",
    "timeline": "within two weeks"
}
system_prompt = build_safety_prompt(intake_data)

# For the chat
system_prompt = CHATBOT_PROMPT
